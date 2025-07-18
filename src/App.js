// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* ── Public ── */
import Home from "./pages/Home";
import PracticeMode from "./pages/PracticeMode";
import PublicLeaderboard from "./pages/Leaderboard";

/* ── Admin ── */
import AdminLogin from "./pages/Admin/Login";
import PrivateRoute from "./routes/PrivateRoute";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/Admin/Dashboard";
import Quizzes from "./pages/Admin/Quizzes";
import QuizPlayList from "./pages/Admin/QuizPlayList";
import QuizPlayLists from "./pages/QuizplayLists";
import AdminLeaderboard from "./pages/Admin/Leaderboard";
import AdminProfile from "./pages/Admin/Profile";
import Questions from "./pages/Admin/Questions";
import QuizPlay from "./pages/QuizPlay";
import Certificate from "./pages/Certificate";
import QuizPlayWebsite from "./pages/QuizPlayWebsite";
  import { ToastContainer, toast } from 'react-toastify';


export default function App() {
  return (
    <BrowserRouter>
            <ToastContainer />

      <Routes>
        {/* ── Public landing ── */}
        <Route path="/" element={<Home />} />
        <Route path="/practice/:quizId" element={<PracticeMode />} />
        <Route path="/leaderboard" element={<PublicLeaderboard />} />
        {/* <Route path="/quizplay/:title/:quizId/:range" element={<QuizPlay />} /> */}
        <Route path="/quizplay/:id/:title/:keyword/:start/:end" element={<QuizPlay />} />
        <Route path="/quizplay/:id" element={<QuizPlayWebsite />} />
        <Route path="/quizplaylists" element={<QuizPlayLists />} />
        <Route path="/certificate/:id/:phone" element={<Certificate />} />

        {/* ── Admin section (protected) ── */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="questions/:quizId" element={<Questions />} />
          <Route path="quizzes" element={<Quizzes />} />
          <Route path="/admin/quizplaylist/:id" element={<QuizPlayList />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="leaderboard" element={<AdminLeaderboard />} />
        </Route>

        {/* fallback → home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
