const express = require('express');
const router = express.Router();
const { generateSchedule } = require('../controllers/assignmentController');

router.post('/assign', generateSchedule);

module.exports = router;