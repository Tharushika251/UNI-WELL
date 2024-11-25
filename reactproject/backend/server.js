const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize Express
const app = express();
const port = 5000; // You can change the port if needed

// Middleware
app.use(cors());
app.use(express.json()); // Use Express's built-in JSON parser

// MongoDB Connection
const mongoURI = 'mongodb+srv://yuvidu:yuvidu@cluster1.kt7i4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1'; // Replace with your MongoDB URI

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit process with failure
  });

// User Schema and Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);




// models/BreakfastTime.js

const breakfastTimeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  breakfastTime: { type: Date, required: true },
});

const BreakfastTime = mongoose.model('BreakfastTime', breakfastTimeSchema);

const LunchTimeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  lunchTime: { type: Date, required: true },
});

const LunchTime = mongoose.model('LunchTime', LunchTimeSchema);

const DinnerTimeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  dinnerTime: { type: Date, required: true },
});

const DinnerTime = mongoose.model('DinnerTime', DinnerTimeSchema);
















// **New: Medicine Time Schema and Model**
const medicineTimeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  medicineName: { type: String, required: true },
  medicineTime: { type: Date, required: true },
});

const MedicineTime = mongoose.model('MedicineTime', medicineTimeSchema);

// New: Water Intake Schema and Model
const waterIntakeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  dailyGoal: { type: Number, required: true }, // e.g., based on weight
  waterIntake: { type: Number, default: 0 }, // Tracks current intake
  lastUpdated: { type: Date, default: Date.now }, // When was the last update
});

const WaterIntake = mongoose.model('WaterIntake', waterIntakeSchema);


// User Registration Route
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  // Optional: Password strength validation
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// User Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare submitted password with stored plaintext password
    if (password !== user.password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Successful login
    res.status(200).json({ message: 'Login successful', userId: user._id });
  } catch (error) {
    console.error('Error logging in:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});



// Save Breakfast Time Route
app.post('/breakfast-time', async (req, res) => {
  const { userId, breakfastTime } = req.body;

  if (!userId || !breakfastTime) {
    return res.status(400).json({ message: 'User ID and breakfast time are required' });
  }

  try {
    const newBreakfastTime = new BreakfastTime({ userId, breakfastTime });
    await newBreakfastTime.save();
    res.status(201).json({ message: 'Breakfast time saved successfully' });
  } catch (error) {
    console.error('Error saving breakfast time:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to get breakfast time by user ID
app.get('/breakfast-time/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const breakfastTimeEntry = await BreakfastTime.findOne({ userId });
    if (!breakfastTimeEntry) {
      return res.status(404).json({ message: 'No breakfast time found for this user' });
    }
    res.status(200).json(breakfastTimeEntry);
  } catch (error) {
    console.error('Error fetching breakfast time:', error.message);
    res.status(500).json({ message: 'Failed to fetch breakfast time' });
  }
});

// Delete all breakfast times for a specific user
app.delete('/breakfast-time/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const deleted = await BreakfastTime.deleteMany({ userId });
    if (deleted.deletedCount === 0) {
      return res.status(404).json({ message: 'No breakfast times found for this user' });
    }
    res.status(200).json({ message: 'All breakfast times deleted successfully' });
  } catch (error) {
    console.error('Error deleting breakfast times:', error.message);
    res.status(500).json({ message: 'Failed to delete breakfast times' });
  }
});



// Save Lunch Time Route
app.post('/lunch-time', async (req, res) => {
  const { userId, lunchTime } = req.body;

  if (!userId || !lunchTime) {
    return res.status(400).json({ message: 'User ID and lunch time are required' });
  }

  try {
    const newLunchTime = new LunchTime({ userId, lunchTime });
    await newLunchTime.save();
    res.status(201).json({ message: 'Lunch time saved successfully' });
  } catch (error) {
    console.error('Error saving lunch time:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to get lunch time by user ID
app.get('/lunch-time/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const lunchTimeEntry = await LunchTime.findOne({ userId });
    if (!lunchTimeEntry) {
      return res.status(404).json({ message: 'No lunch time found for this user' });
    }
    res.status(200).json(lunchTimeEntry);
  } catch (error) {
    console.error('Error fetching lunch time:', error.message);
    res.status(500).json({ message: 'Failed to fetch lunch time' });
  }
});

// Delete all lunch times for a specific user
app.delete('/lunch-time/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const deleted = await LunchTime.deleteMany({ userId });
    if (deleted.deletedCount === 0) {
      return res.status(404).json({ message: 'No lunch times found for this user' });
    }
    res.status(200).json({ message: 'All lunch times deleted successfully' });
  } catch (error) {
    console.error('Error deleting lunch times:', error.message);
    res.status(500).json({ message: 'Failed to delete lunch times' });
  }
});




// Save Dinner Time Route
app.post('/dinner-time', async (req, res) => {
  const { userId, dinnerTime } = req.body;

  if (!userId || !dinnerTime) {
    return res.status(400).json({ message: 'User ID and dinner time are required' });
  }

  try {
    const newDinnerTime = new DinnerTime({ userId, dinnerTime });
    await newDinnerTime.save();
    res.status(201).json({ message: 'Dinner time saved successfully' });
  } catch (error) {
    console.error('Error saving dinner time:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to get dinner time by user ID
app.get('/dinner-time/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const dinnerTimeEntry = await DinnerTime.findOne({ userId });
    if (!dinnerTimeEntry) {
      return res.status(404).json({ message: 'No dinner time found for this user' });
    }
    res.status(200).json(dinnerTimeEntry);
  } catch (error) {
    console.error('Error fetching dinner time:', error.message);
    res.status(500).json({ message: 'Failed to fetch dinner time' });
  }
});

// Delete all dinner times for a specific user
app.delete('/dinner-time/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const deleted = await DinnerTime.deleteMany({ userId });
    if (deleted.deletedCount === 0) {
      return res.status(404).json({ message: 'No dinner times found for this user' });
    }
    res.status(200).json({ message: 'All dinner times deleted successfully' });
  } catch (error) {
    console.error('Error deleting dinner times:', error.message);
    res.status(500).json({ message: 'Failed to delete dinner times' });
  }
});













// **New: Save Medicine Time Route**
app.post('/medicine-time', async (req, res) => {
  const { userId, medicineName, medicineTime } = req.body;

  if (!userId || !medicineName || !medicineTime) {
    return res.status(400).json({ message: 'User ID, medicine name, and medicine time are required' });
  }

  try {
    const newMedicineTime = new MedicineTime({ userId, medicineName, medicineTime });
    await newMedicineTime.save();
    res.status(201).json({ message: 'Medicine reminder saved successfully' });
  } catch (error) {
    console.error('Error saving medicine reminder:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// **New: Get Medicine Times Route**
app.get('/medicine-time/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const medicineTimes = await MedicineTime.find({ userId }).sort({ medicineTime: 1 });
    if (medicineTimes.length === 0) {
      return res.status(404).json({ message: 'No medicine reminders found for this user' });
    }
    res.status(200).json(medicineTimes);
  } catch (error) {
    console.error('Error fetching medicine reminders:', error.message);
    res.status(500).json({ message: 'Failed to fetch medicine reminders' });
  }
});

// **New: Delete Medicine Time Route**
app.delete('/medicine-time/:userId/:medicineName', async (req, res) => {
  const { userId, medicineName } = req.params;

  try {
    const deleted = await MedicineTime.findOneAndDelete({ userId, medicineName });
    if (!deleted) {
      return res.status(404).json({ message: 'Medicine reminder not found' });
    }
    res.status(200).json({ message: 'Medicine reminder deleted successfully' });
  } catch (error) {
    console.error('Error deleting medicine reminder:', error.message);
    res.status(500).json({ message: 'Failed to delete medicine reminder' });
  }
});


// Save Water Intake Route
app.post('/water-intake', async (req, res) => {
  const { userId, dailyGoal } = req.body;

  if (!userId || !dailyGoal) {
    return res.status(400).json({ message: 'User ID and daily goal are required' });
  }

  try {
    const waterIntake = new WaterIntake({ userId, dailyGoal });
    await waterIntake.save();
    res.status(201).json({ message: 'Water intake goal saved successfully' });
  } catch (error) {
    console.error('Error saving water intake:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Water Intake by User ID
app.get('/water-intake/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const waterIntake = await WaterIntake.findOne({ userId });
    if (!waterIntake) {
      return res.status(404).json({ message: 'No water intake data found for this user' });
    }
    res.status(200).json(waterIntake);
  } catch (error) {
    console.error('Error fetching water intake data:', error.message);
    res.status(500).json({ message: 'Failed to fetch water intake data' });
  }
});

// Update Water Intake Route
app.post('/water-intake/update', async (req, res) => {
  const { userId, amount } = req.body;

  if (!userId || !amount) {
    return res.status(400).json({ message: 'User ID and amount are required' });
  }

  try {
    const waterIntake = await WaterIntake.findOne({ userId });
    if (!waterIntake) {
      return res.status(404).json({ message: 'No water intake data found for this user' });
    }

    waterIntake.waterIntake += amount; // Increment water intake
    waterIntake.lastUpdated = Date.now(); // Update timestamp
    await waterIntake.save();

    res.status(200).json({ message: 'Water intake updated successfully', waterIntake });
  } catch (error) {
    console.error('Error updating water intake:', error.message);
    res.status(500).json({ message: 'Failed to update water intake' });
  }
});

// Reset Water Intake Route
app.post('/water-intake/reset', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const waterIntake = await WaterIntake.findOne({ userId });
    if (!waterIntake) {
      return res.status(404).json({ message: 'No water intake data found for this user' });
    }

    waterIntake.waterIntake = 0; // Reset water intake
    waterIntake.lastUpdated = Date.now(); // Update timestamp
    await waterIntake.save();

    res.status(200).json({ message: 'Water intake reset successfully' });
  } catch (error) {
    console.error('Error resetting water intake:', error.message);
    res.status(500).json({ message: 'Failed to reset water intake' });
  }
});

// Delete Water Intake Data Route
app.delete('/water-intake/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const deleted = await WaterIntake.deleteMany({ userId });
    if (deleted.deletedCount === 0) {
      return res.status(404).json({ message: 'No water intake data found for this user' });
    }
    res.status(200).json({ message: 'All water intake data deleted successfully' });
  } catch (error) {
    console.error('Error deleting water intake data:', error.message);
    res.status(500).json({ message: 'Failed to delete water intake data' });
  }
});


// Import Routes
const routineRoutes = require('./routes/routines');
const checkinRoutes = require('./routes/checkins');
const weeklySummaryRoutes = require('./routes/weeklySummary');
const journalRoutes = require('./routes/journal'); // Fixed typo from 'jorunal' to 'journal'

// Plan, BMI, and Quiz Routes
const planRoutes = require('./routes/planRoutes');
const bmiRoutes = require('./routes/bmiRouter');
const quizRoutes = require('./routes/quizRouter');

// Use Routes
app.use('/routines', routineRoutes);
app.use('/checkins', checkinRoutes);
app.use('/weekly-summary', weeklySummaryRoutes);
app.use('/api', journalRoutes);
app.use('/plan', planRoutes);
app.use('/bmi', bmiRoutes); // Fixed to a more logical endpoint
app.use('/quiz', quizRoutes); // Fixed to a more logical endpoint


// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
