const express = require('express');
const router = express.Router();
const WorkoutPlan = require('../models/WorkoutPlan');

// Create a new plan
// router.post('/createPlan', async (req, res) => {
//   const {
//     studentId,
//     category,
//     Days,
//     cardioTime,
//     strengthTime,
//     flexibilityTime,
//     Breakfast,
//     Lunch,
//     Dinner,
//     diet,
//   } = req.body;

//   try {
//     const newPlan = new Plan({
//       studentId,
//       category,
//       Days,
//       cardioTime,
//       strengthTime,
//       flexibilityTime,
//       Breakfast,
//       Lunch,
//       Dinner,
//       diet,
//     });

//     await newPlan.save();
//     res.status(201).json({ message: 'Plan saved successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Error saving plan', error: err });
//   }
// });

// // Get all plans
// router.get('/', async (req, res) => {
//   try {
//     const plans = await Plan.find();
//     res.json(plans);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error fetching plans', error: err });
//   }
// });

// // Update a plan
// router.put('/update/:id', async (req, res) => {
//   try {
//     const planId = req.params.id;
//     const updatedPlan = await Plan.findByIdAndUpdate(planId, req.body, {
//       new: true,
//     });

//     if (!updatedPlan) {
//       return res.status(404).json({ message: 'Plan Not Found' });
//     }

//     res.status(200).json({ message: 'Plan Updated', plan: updatedPlan });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ message: 'Error updating plan', error: error.message });
//   }
// });

// Delete a plan
router.delete('/delete/:id', async (req, res) => {
  const planId = req.params.id;

  try {
    const deletedPlan = await WorkoutPlan.findByIdAndDelete(planId);

    if (!deletedPlan) {
      return res.status(404).json({ message: 'Plan Not Found' });
    }

    res.status(200).json({ message: 'Plan Deleted' });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ message: 'Error deleting plan', error: err.message });
  }
});


router.get('/get/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find the most recent incomplete workout plan for the user
    const plan = await WorkoutPlan.findOne({ userId, isCompleted: false }).sort(
      { startDate: -1 }
    ); // Sort by creation date in descending order

    if (!plan) {
      return res
        .status(404)
        .json({ message: 'Workout plan not found for this user.' });
    }

    res.status(200).json({
      message: 'Workout Plan Fetched',
      plan, // Return the last (most recent) plan in the response
    });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ message: 'Error fetching workout plan', error: err.message });
  }
});

router.post('/addWorkout', async (req, res) => {
  const { userId, category, days } = req.body;

  // Set the number of days for the workout plan
  const numberOfDays = 7;

  // Get the current date as the starting date
  const startDate = new Date();

  try {
    // Check if the user has any incomplete workout plans
    const existingPlans = await WorkoutPlan.find({ userId });

    // Check if any existing plan's end date is in the future
    const hasIncompletePlan = existingPlans.some(
      (plan) => plan.endDate > startDate
    );

    if (hasIncompletePlan) {
      return res.status(400).json({
        message:
          'You have an incomplete workout plan. Complete it before creating a new one.',
      });
    }

    // Automatically generate a 7-day workout and meal plan with the same structure each day
    const workoutDays = [];
    let eDate = ''; // Declare eDate outside loop

    for (let i = 0; i < numberOfDays; i++) {
      const dayDate = new Date();
      dayDate.setDate(startDate.getDate() + i); // Increment the date for each day

      workoutDays.push({
        date: dayDate,
        workouts: days[0].workouts, // Use the workouts from the first day provided in the request body
        Meal: days[0].Meal, // Use the meal from the first day provided in the request body
      });

      eDate = dayDate; // Update eDate with the latest dayDate
    }

    // Create the new workout plan with the auto-generated days
    const newPlan = new WorkoutPlan({
      userId,
      category,
      isCompleted: false, // New plans start as incomplete
      remainingDays: numberOfDays, // Set the remaining days for the new plan
      days: workoutDays,
      startDate,
      endDate: eDate,
    });

    // Save the workout plan to the database
    await newPlan.save();
    res.status(201).json({ message: 'Plan saved successfully', plan: newPlan });
  } catch (err) {
    console.error('Error saving workout plan:', err); // Log the error for debugging
    res.status(500).json({ message: 'Error saving plan', error: err });
  }
});


router.put('/updateWorkoutStatus', async (req, res) => {
  const { planId, workoutId, completed } = req.body;

  try {
    // Validate input
    if (!planId || !workoutId) {
      return res.status(400).json({
        message: 'Plan ID and Workout ID are required.',
      });
    }

    // Find the workout plan by planId
    const plan = await WorkoutPlan.findOne({
      _id: planId,
      'days.workouts._id': workoutId,
    });

    if (!plan) {
      return res.status(404).json({
        message: 'Workout plan or workout not found.',
      });
    }

    // Update the specific workout's completion status
    const updatedPlan = await WorkoutPlan.findOneAndUpdate(
      {
        _id: planId,
        'days.workouts._id': workoutId,
      },
      {
        $set: { 'days.$[].workouts.$[workout].completed': completed },
      },
      {
        arrayFilters: [{ 'workout._id': workoutId }], // Filter to match the specific workout
        new: true, // Return the updated document
      }
    );

    if (!updatedPlan) {
      return res.status(404).json({
        message: 'Failed to update the workout status.',
      });
    }

    res.status(200).json({
      message: 'Workout status updated successfully',
      plan: updatedPlan,
    });
  } catch (err) {
    console.error('Error updating workout status:', err.message);
    res.status(500).json({
      message: 'Error updating workout status',
      error: err.message,
    });
  }
});

router.put('/updateMealsStatus', async (req, res) => {
  const { planId, workoutId, completed } = req.body;

  try {
    // Validate input
    if (!planId || !workoutId) {
      return res.status(400).json({
        message: 'Plan ID and Workout ID are required.',
      });
    }

    // Find the workout plan by planId
    const plan = await WorkoutPlan.findOne({
      _id: planId,
      'days.Meal._id': workoutId,
    });

    if (!plan) {
      return res.status(404).json({
        message: 'Workout plan or workout not found.',
      });
    }

    // Update the specific meal's completion status within the workout plan
    const updatedPlan = await WorkoutPlan.findOneAndUpdate(
      {
        _id: planId,
        'days.Meal._id': workoutId,
      },
      {
        $set: { 'days.$[day].Meal.$[meal].completed': completed },
      },
      {
        arrayFilters: [
          { 'day.Meal._id': workoutId }, // Filter to match the day containing the workout
          { 'meal._id': workoutId }, // Filter to match the specific meal/workout
        ],
        new: true, // Return the updated document
      }
    );

    if (!updatedPlan) {
      return res.status(404).json({
        message: 'Failed to update the workout status.',
      });
    }

    res.status(200).json({
      message: 'Workout status updated successfully',
      plan: updatedPlan,
    });
  } catch (err) {
    console.error('Error updating workout status:', err.message);
    res.status(500).json({
      message: 'Error updating workout status',
      error: err.message,
    });
  }
});













module.exports = router;
