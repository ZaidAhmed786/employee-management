const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'] // Error message for required field
  },

  checkInTime: {
    type: Date,
    default: Date.now // Default value is set to the current time when not provided
  },
  
  checkOutTime: {
    type: Date,
    validate: { // Validation for check-out time
      validator: function(value) {
        return !this.checkInTime || value >= this.checkInTime; // Check-out time must be greater than or equal to check-in time
      },
      message: 'Check-out time must be later than or equal to check-in time'
    }
  }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
