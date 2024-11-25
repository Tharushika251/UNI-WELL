import axios from 'axios';

const API = axios.create({
  baseURL: 'http://192.168.100.135:5000/plan',
});

// API calls for the Plan feature
export const getPlans = () => API.get('/'); // Adjusted to fetch all plans
export const createPlan = (planData) => API.post('/addWorkout', planData); 
export const updatePlan = (id, updatedData) =>
  API.put(`/update/${id}`, updatedData); // Adjusted for updating a specific plan
export const deleteWorkoutPlan = (id) => API.delete(`/delete/${id}`); // Adjusted to delete a specific plan
export const getPlanByUserId = (userId) => API.get(`/get/${userId}`); // Adjusted to fetch a plan by studentId
export const updateWorkoutStatus = (planId, workoutId, workoutType, completed) =>
  API.put('/updateWorkoutStatus', {
    planId,
    workoutId,
    workoutType,
    completed,
  });
export const updateMealsStatus = (planId, workoutId, workoutType, completed) =>
  API.put('/updateMealsStatus', {
    planId,
    workoutId,
    workoutType,
    completed,
  });


export const getWorkoutStatus = (userId) => API.get(`/getWorkoutStatus/${userId}`);


// API calls for the BMI  feature
export const AddBMI = (bmiData) => API.post('/addBMI', bmiData); 
export const getBMI = (id) => API.get(`/getBMI/${id}`);
export const getLatestBMI = (id) => API.get(`/getLatestBMI/${id}`);
export const addQuiz = (quizData) => API.post('/addQuiz', quizData); 
export const getQuiz = (id) => API.get(`/getQuiz/${id}`);