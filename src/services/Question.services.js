import api from "./Axios"; // ✅ your base Axios instance

const QuestionServices = {
  // Get all questions for a specific quiz
  getByQuestionsBYId: async (data) => {
    const res = await api.post(`/questions/quiz/`,data);
    return res.data;
  },
  getAllByQuestionsBYId: async (data) => {
    const res = await api.get(`/questions/quiz/${data}`,);
    return res.data;
  },

  // Create a new question
  create: async (data) => {
    const res = await api.post("/questions/create", data);
    return res.data;
  },

  // Update an existing question
  update: async (data) => {
    const res = await api.post(`/questions/update`, data);
    return res.data;
  },

  // Delete a question
  delete: async (id) => {
    const res = await api.post(`/questions/delete`,id);
    return res.data;
  },

  // Get single question (optional, if needed)
  getById: async (id) => {
    const res = await api.get(`/questions/${id}`);
    return res.data;
  },

  getByQuizId: async (id) => {
    const res = await api.get(`/quiz/${id}`);
    return res.data;
  },

  getCertificate: async (id,phone) => { 
    const data = {
      id,phone
    }
    const res = await api.post(`/get-certificate-data`,data);
    return res.data;
  },
  getQuizPlayDetails: async (id) => { 
    const data = {
      id
    }
    const res = await api.post(`/get-quiz-play-byid`,data);
    return res.data;
  },
};

export default QuestionServices;
