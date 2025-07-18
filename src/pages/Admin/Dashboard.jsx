// src/pages/Admin/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MdQuiz,
  MdLeaderboard,
  MdAccessTime,
  MdHistoryEdu,
} from "react-icons/md";
import { FiDownload } from "react-icons/fi";
import * as XLSX from "xlsx";

import { BsPeopleFill, BsBarChartFill } from "react-icons/bs";
import { AttemptsBar, ScorePie } from "../../components/DashboardCharts";
import QuizServices from "../../services/Quiz.services";

const fade = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0 },
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    quizzes: 0,
    users: 0,
    attempts: 0,
    leaderboard: 0,
    recentAttempts: [],
  });

  const [loading, setLoading] = useState(true);

  const cards = [
    {
      id: 1,
      label: "No Of Quizes",
      icon: MdQuiz,
      value: stats.quizzes,
      ring: "ring-primary/40",
      bg: "bg-white/40 backdrop-blur",
    },
    {
      id: 2,
      label: "No Of Questions",
      icon: MdHistoryEdu ,
      value: stats.questions,
      ring: "ring-success/40",
      bg: "bg-white/40 backdrop-blur",
    },
    {
      id: 3,
      label: "Total Attempts",
      icon: BsBarChartFill,
      value: stats.attempts,
      ring: "ring-warning/40",
      bg: "bg-white/40 backdrop-blur",
    },
    {
      id: 4,
      label: "Our Users",
      icon: BsPeopleFill,
      value: stats.leaderboard,
      ring: "ring-secondary/40",
      bg: "bg-white/40 backdrop-blur",
    },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await QuizServices.getStats();
        setStats(res.data);
      } catch (err) {
        console.error("Dashboard fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const exportToExcel = async () => {

    const Data = await QuizServices.getLeaderboard()
    const worksheet = XLSX.utils.json_to_sheet(Data.data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Recent_Attempts");
    XLSX.writeFile(workbook, "Recent_Quiz_Attempts.xlsx");
  };

  return (
    <div className="flex min-h-screen bg-bg">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 px-6 py-10 space-y-10 overflow-y-auto">
          {/* ─── Stats Cards ─── */}
          <motion.div
            className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            variants={fade}
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: 0.12 }}
          >
            {cards.map(({ id, label, value, icon: Icon, ring, bg }) => (
              <motion.div
                key={id}
                variants={fade}
                className={`relative p-6 rounded-sm shadow-lg ${bg} ring-2 ${ring}
                hover:-translate-y-1 hover:shadow-2xl transition`}
              >
                <Icon className="text-4xl text-primary mb-3 drop-shadow" />
                <p className="text-xs uppercase font-medium text-textSecondary">
                  {label}
                </p>
                <motion.h4
                  key={value}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-4xl font-extrabold text-textPrimary"
                >
                  {value}
                </motion.h4>
              </motion.div>
            ))}
          </motion.div>

          {/* ─── Charts ─── */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white border-2 p-2 ring-primary/15">
              <h3 className="card-title">
                <MdAccessTime /> QUIZ ATTEMPTS BY WEEKLY
              </h3>
              <AttemptsBar />
            </div>
            <div className=" ring-secondary/20 bg-white border-2 p-2">
              <h3 className="card-title">
                <BsBarChartFill /> AVG SCORES BY CHAPTERS
              </h3>
              <ScorePie />
            </div>
          </div>

          {/* ─── Recent Attempts ─── */}
          <div className="rounded-sm bg-white/80 backdrop-blur ring-1 ring-primary/10 shadow p-6 overflow-x-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold flex items-center gap-2 text-textPrimary">
                <MdHistoryEdu /> Recent Quiz Attempts
              </h3>
              <button
                onClick={exportToExcel}
                className="flex items-center text-sm text-blue-600 hover:underline"
              >
                <FiDownload className="mr-1" /> Export
              </button>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-primary/10">
                <tr>
                  <th className="px-3 py-2">User</th>
                  <th className="px-3 py-2">Quiz</th>
                  <th className="px-3 py-2">Score</th>
                  <th className="px-3 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentAttempts.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-3 py-2 text-center text-textSecondary"
                    >
                      No recent attempts
                    </td>
                  </tr>
                ) : (
                  stats.recentAttempts.map((r, i) => (
                    <tr key={i} className="odd:bg-white/50">
                      <td className="px-3 py-2">{r.name}</td>
                      <td className="px-3 py-2">{r.quiz}</td>
                      <td className="px-3 py-2">{r.score}</td>
                      <td className="px-3 py-2">{r.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
