const mongoose = require('mongoose');

const WorkoutPlanSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  category: { type: String, required: true },
  startDate: { type: Date, required: true, default: Date.now },
  isCompleted: { type: Boolean, default: false },
  remainingDays: { type: Number, default: 7 },
  endDate: { type: Date },
  days: [
    {
      date: { type: Date, required: true },
      workouts: [
        {
          type: { type: String, required: true },
          duration: { type: String, required: true },
          completed: { type: String, default: 'Pending' },
        },
      ],
      Meal: [
        {
          type: { type: String, required: true },
          description: { type: String, required: true },
          completed: { type: String, default: 'Pending' },
        },
      ],
    },
  ],
});

const WorkoutPlan = mongoose.model('WorkoutPlan', WorkoutPlanSchema);

module.exports = WorkoutPlan;
