const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// 1. IN-MEMORY DATA (No Database Required!)
// ==========================================

let assignments = []; // This will hold your generated schedules

const rooms = [
  // Big Halls
  { _id: 'r1', name: 'G1', isBigHall: true, capacity: 91 }, { _id: 'r2', name: 'G2', isBigHall: true, capacity: 91 },
  { _id: 'r3', name: 'F1', isBigHall: true, capacity: 91 }, { _id: 'r4', name: 'F2', isBigHall: true, capacity: 91 },
  { _id: 'r5', name: 'S1', isBigHall: true, capacity: 91 }, { _id: 'r6', name: 'S2', isBigHall: true, capacity: 91 },
  { _id: 'r7', name: 'B2', isBigHall: true, capacity: 91 },
  // Standard Rooms
  { _id: 'r8', name: 'G3', isBigHall: false, capacity: 32 }, { _id: 'r9', name: 'G4', isBigHall: false, capacity: 32 },
  { _id: 'r10', name: 'G5', isBigHall: false, capacity: 32 }, { _id: 'r11', name: 'F3', isBigHall: false, capacity: 32 },
  { _id: 'r12', name: 'F4', isBigHall: false, capacity: 32 }, { _id: 'r13', name: 'F5', isBigHall: false, capacity: 32 },
  { _id: 'r14', name: 'F6', isBigHall: false, capacity: 32 }, { _id: 'r15', name: 'S3', isBigHall: false, capacity: 32 },
  { _id: 'r16', name: 'S4', isBigHall: false, capacity: 32 }, { _id: 'r17', name: 'S5', isBigHall: false, capacity: 32 },
  { _id: 'r18', name: 'S6', isBigHall: false, capacity: 32 }, { _id: 'r19', name: 'B3', isBigHall: false, capacity: 32 },
  { _id: 'r20', name: 'B4', isBigHall: false, capacity: 32 }, { _id: 'r21', name: 'B5', isBigHall: false, capacity: 32 },
  // Special Rooms
  { _id: 'r22', name: 'Studio-I', isBigHall: false, capacity: 60 }, { _id: 'r23', name: 'Studio-II', isBigHall: false, capacity: 60 },
  { _id: 'r24', name: 'G-6 (PwD)', isBigHall: false, capacity: 32 }
];

const invigilators = [
  // I3: Senior Faculty
  { _id: 'i1', name: 'Prof. Yogeshver Dutt Sharma', type: 'I3', workload: 0 }, { _id: 'i2', name: 'Prof. Sunil', type: 'I3', workload: 0 },
  { _id: 'i3', name: 'Prof. Ravi Kumar', type: 'I3', workload: 0 }, { _id: 'i4', name: 'Prof. Minakshi Jain', type: 'I3', workload: 0 },
  { _id: 'i5', name: 'Prof. Bhanu M. Marwaha', type: 'I3', workload: 0 }, { _id: 'i6', name: 'Prof. Ravi Kumar Sharma', type: 'I3', workload: 0 },
  { _id: 'i7', name: 'Prof. R.K. Dutta', type: 'I3', workload: 0 }, { _id: 'i8', name: 'Dr. Pardeep Kumar', type: 'I3', workload: 0 },
  { _id: 'i9', name: 'Dr. Mohd. Adil', type: 'I3', workload: 0 }, { _id: 'i10', name: 'Dr. Vishal Singh', type: 'I3', workload: 0 },
  // I2: PhD & Research Scholars
  { _id: 'i11', name: 'Anisha Devi', type: 'I2', workload: 0 }, { _id: 'i12', name: 'Aditi Joshi', type: 'I2', workload: 0 },
  { _id: 'i13', name: 'Avinash Yadav', type: 'I2', workload: 0 }, { _id: 'i14', name: 'Mohd Shadab', type: 'I2', workload: 0 },
  { _id: 'i15', name: 'Priyanshu Kumar', type: 'I2', workload: 0 }, { _id: 'i16', name: 'Kamal Gulwani', type: 'I2', workload: 0 },
  { _id: 'i17', name: 'Komal Juneja', type: 'I2', workload: 0 }, { _id: 'i18', name: 'Renu Sharma', type: 'I2', workload: 0 },
  { _id: 'i19', name: 'Shalini Saini', type: 'I2', workload: 0 }, { _id: 'i20', name: 'Amit K. Chaursia', type: 'I2', workload: 0 },
  // I1: Course Coordinators / Assistant Professors
  { _id: 'i21', name: 'Dr. Suket Kumar', type: 'I1', workload: 0 }, { _id: 'i22', name: 'Dr. Subit Kumar Jain', type: 'I1', workload: 0 },
  { _id: 'i23', name: 'Dr. Talari Ganesh', type: 'I1', workload: 0 }, { _id: 'i24', name: 'Dr. Om Prakash Yadav', type: 'I1', workload: 0 },
  { _id: 'i25', name: 'Dr. Rifaqat Ali', type: 'I1', workload: 0 }, { _id: 'i26', name: 'Dr. Sachin Kumar', type: 'I1', workload: 0 },
  { _id: 'i27', name: 'Dr. Neeraj Dhiman', type: 'I1', workload: 0 }, { _id: 'i28', name: 'Dr. Vikram Verma', type: 'I1', workload: 0 },
  { _id: 'i29', name: 'Dr. Rita Maurya', type: 'I1', workload: 0 }
];

// ==========================================
// 2. CORE SCHEDULING ALGORITHM
// ==========================================

app.post('/api/assign', (req, res) => {
  const { date, session } = req.body;

  // Check if we already generated a schedule for this exact date/time
  const exists = assignments.some(a => a.date === date && a.session === session);
  if (exists) {
    return res.status(400).json({ error: 'Schedule already exists for this slot. Please choose another date/session.' });
  }

  const bigHalls = rooms.filter(r => r.isBigHall);
  const normalRooms = rooms.filter(r => !r.isBigHall);

  // Sort available staff by workload (lowest workload gets assigned first)
  let i3Available = invigilators.filter(i => i.type === 'I3').sort((a, b) => a.workload - b.workload);
  let i1i2Available = invigilators.filter(i => i.type === 'I1' || i.type === 'I2').sort((a, b) => a.workload - b.workload);

  const newAssignments = [];

  // Assign Big Halls (Needs I3)
  for (const hall of bigHalls) {
    if (i3Available.length === 0) return res.status(400).json({ error: `Not enough I3 Senior Faculty for Big Hall: ${hall.name}` });
    
    const assignedI3 = i3Available.shift();
    
    // Update workload tracker
    const realInvigilatorIndex = invigilators.findIndex(i => i._id === assignedI3._id);
    invigilators[realInvigilatorIndex].workload += 1;

    newAssignments.push({
      _id: Math.random().toString(36).substring(7),
      date, session, room: hall, invigilators: [assignedI3]
    });
  }

  // Assign Normal Rooms (Needs I1 or I2)
  for (const room of normalRooms) {
    if (i1i2Available.length === 0) return res.status(400).json({ error: `Not enough I1/I2 staff for room: ${room.name}` });

    const assignedNormal = i1i2Available.shift();
    
    // Update workload tracker
    const realInvigilatorIndex = invigilators.findIndex(i => i._id === assignedNormal._id);
    invigilators[realInvigilatorIndex].workload += 1;

    newAssignments.push({
      _id: Math.random().toString(36).substring(7),
      date, session, room, invigilators: [assignedNormal]
    });
  }

  // Save to our in-memory array
  assignments.push(...newAssignments);

  // Send the result back to the React frontend
  res.status(200).json(newAssignments);
});

// ==========================================
// 3. START SERVER
// ==========================================
app.listen(5000, () => console.log('Database-Free Backend running on port 5000'));