import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import QuizServices from "../services/Quiz.services";

const COLORS = ["#3b82f6", "#f97316", "#22c55e", "#a855f7", "#ec4899", "#eab308", "#0ea5e9"];

/* ─── Weekly Quiz Attempts Bar Chart ───────────────────────────── */
export const AttemptsBar = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const res = await QuizServices.getWeeklyAttempts();
        setData(res.data || []);
      } catch (err) {
        console.error("Failed to load weekly attempts", err);
      }
    };
    fetchAttempts();
  }, []);
const BAR_COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Green
  "#f59e0b", // Amber
  "#8b5cf6", // Violet
  "#6366f1", // Indigo
  "#14b8a6", // Teal
  "#ec4899", // Rose
];
  return (
    <div className="bg-white rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-2">Weekly Quiz Attempts</h2>
<ResponsiveContainer width="100%" height={260}>
  <BarChart data={data}>
    <XAxis dataKey="day" tick={{ fill: "#333", fontSize: 12 }} />
    <YAxis allowDecimals={false} />
    <Tooltip
      contentStyle={{ backgroundColor: "#fff", borderRadius: "6px", border: "1px solid #ccc" }}
      cursor={{ fill: "transparent" }} // Removes gray hover effect
    />
    <Bar dataKey="total" radius={[8, 8, 0, 0]} barSize={40}>
      {data.map((_, index) => (
        <Cell key={`bar-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
      ))}
    </Bar>
  </BarChart>
</ResponsiveContainer>


    </div>
  );
};

/* ─── Average Scores Pie Chart ───────────────────────────── */
export const ScorePie = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const res = await QuizServices.getAverageScores();
        const formatted = (res.data || []).map(item => ({
          ...item,
          avg_score: parseFloat(item.avg_score)
        }));
        setData(formatted);
      } catch (err) {
        console.error("Failed to load average scores", err);
      }
    };
    fetchScores();
  }, []);

  return (
    <div className="bg-white  rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-2">Average Scores by Quiz</h2>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="avg_score"
            nameKey="quiz"
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={50}
            label={({ name, percent }) =>
              `${name} (${(percent * 100).toFixed(0)}%)`
            }
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          {/* <Tooltip /> */}
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
