import axios from "./Axios";

const UserServices = {
  getProfileById: (id) => axios.get(`/users/${id}`),
  updateProfile: (data) => axios.post(`/users/update`, data),
  uploadAvatar: (formData) =>
  axios.post("/users/upload-avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
  changePassword: (data) => axios.post(`/users/change-password`,data ),
};

export default UserServices;
