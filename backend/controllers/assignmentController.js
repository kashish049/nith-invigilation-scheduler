const Invigilator = require('../models/Invigilator');
const Room = require('../models/Room');
const Assignment = require('../models/Assignment');

exports.generateSchedule = async (req, res) => {
  try {
    const { date, session } = req.body;

    // Check if schedule already exists for this date and session
    const existing = await Assignment.find({ date, session });
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Schedule already exists for this slot. Please choose another or clear the existing one.' });
    }

    const rooms = await Room.find({});
    const invigilators = await Invigilator.find({});

    const bigHalls = rooms.filter(r => r.isBigHall);
    const normalRooms = rooms.filter(r => !r.isBigHall);

    // Sort by workload to ensure equal duty load
    let i3Available = invigilators.filter(i => i.type === 'I3').sort((a, b) => a.workload - b.workload);
    let i1i2Available = invigilators.filter(i => i.type === 'I1' || i.type === 'I2').sort((a, b) => a.workload - b.workload);

    const newAssignments = [];
    const updatedInvigilators = new Set(); 

    // 1. Assign Big Halls (Requires at least 1 I3)
    for (const hall of bigHalls) {
      if (i3Available.length === 0) {
        return res.status(400).json({ error: `Not enough I3 invigilators for big hall: ${hall.name}` });
      }
      
      const assignedI3 = i3Available.shift();
      assignedI3.workload += 1;
      updatedInvigilators.add(assignedI3);

      newAssignments.push({
        date, session, room: hall._id, invigilators: [assignedI3._id]
      });
    }

    // 2. Assign Normal Rooms (Requires 1 I1 or I2)
    for (const room of normalRooms) {
      if (i1i2Available.length === 0) {
        return res.status(400).json({ error: `Not enough I1/I2 invigilators for room: ${room.name}` });
      }

      const assignedNormal = i1i2Available.shift();
      assignedNormal.workload += 1;
      updatedInvigilators.add(assignedNormal);

      newAssignments.push({
        date, session, room: room._id, invigilators: [assignedNormal._id]
      });
    }

    // 3. Save to database
    await Assignment.insertMany(newAssignments);
    
    // 4. Update workloads
    for (const inv of updatedInvigilators) {
      await Invigilator.findByIdAndUpdate(inv._id, { workload: inv.workload });
    }

    // 5. Return the finalized schedule
    const populatedAssignments = await Assignment.find({ date, session })
      .populate('room')
      .populate('invigilators');

    res.status(200).json(populatedAssignments);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during assignment generation' });
  }
};