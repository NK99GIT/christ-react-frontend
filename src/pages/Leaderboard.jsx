import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shimmer } from "react-shimmer";
import { MdArrowBack } from "react-icons/md"; 

export default function Leaderboard() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const leaderboardData = [];
        setLeaderboard(leaderboardData.data); // Top 25
      } catch (err) {
        console.error("API failed:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const medal = (rank) => {
    return rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank;
  };

  if (loading) return <Shimmer width="100%" height={260} />;

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      {/* ==== Gradient header ==== */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-primary to-purpleAccent text-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => nav(-1)}
            className="flex items-center gap-1 hover:underline"
          >
            <MdArrowBack /> Back
          </button>
          <h1 className="text-2xl font-extrabold">Global Leaderboard</h1>
        </div>
      </header>

      {/* ==== Table ==== */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-10 w-full">
        {leaderboard.length ? (
          <div className="overflow-x-auto bg-white rounded-sm shadow-lg">
            <table className="w-full text-left">
              <thead className="bg-primary text-white text-sm">
                <tr>
                  <th className="px-5 py-3 w-[80px]">Rank</th>
                  <th className="px-5 py-3">Player</th>
                  <th className="px-5 py-3">Points</th>
                  <th className="px-5 py-3 hidden sm:table-cell">Attempts</th>
                  <th className="px-5 py-3 hidden sm:table-cell">Avg %</th>
                  <th className="px-5 py-3 hidden md:table-cell">Best Quiz</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {leaderboard.map((r, i) => (
                  <tr
                    key={r.rank_pos}
                    className={`border-b last:border-none
                      odd:bg-primary/5 hover:bg-primary/10 transition
                      ${i + 1 >= 4 && i + 1 <= 10 ? "bg-success/5" : ""}`}
                  >
                    <td className="px-5 py-3 font-bold">{medal(r.rank_pos)}</td>
                    <td className="px-5 py-3 flex items-center gap-3">
                      <img
                        src={r.avatar || `https://i.pravatar.cc/40?u=${r.username}`}
                        alt={r.username}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      {r.username.charAt(0).toUpperCase() + r.username.slice(1)}
                    </td>
                    <td className="px-5 py-3">{r.total_score}</td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      {r.total_quizzes}
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      {r.avg_pct || "--"}
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      {r.best_quiz || "--"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-textSecondary">No leaderboard data found.</p>
        )}

        <div className="text-center mt-8">
          <Link to="/" className="text-primary underline">
            ← Return&nbsp;Home
          </Link>
        </div>
      </main>
    </div>
  );
}
