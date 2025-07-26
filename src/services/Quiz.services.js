// src/services/Quiz.services.js
import Axios from "./Axios"; // ✅ Use custom Axios with token & baseURL

const QuizServices = {
  getAll: () => Axios.post("/quiz/all"),
  create: (data) => Axios.post("/quiz/create", data),
  update: (data) => Axios.post("/quiz/update", data),
  remove: (id) => Axios.post("/quiz/delete", { id }),
  saveResult: (data)=> Axios.post("/save-result", { data }),
  getLeaderboard: (data) => Axios.post("/all-result",{data}),
  getStats: () => Axios.get("/dashboard/stats"),
  getWeeklyAttempts: () => Axios.get("/dashboard/weekly-attempts"),
  getAverageScores: () => Axios.get("/dashboard/average-score"),
  createQuizPlay: (data) => Axios.post("/create-quiz-play", data),
  getQuizPlay: (data) => Axios.post("/get-quiz-play", data),
  getQuizAllPlay: (data) => Axios.post("/get-all-quiz-play", data),
  deleteQuizPlay: (data) => Axios.post("/delete-quiz-play", data),
};



export default QuizServices;
