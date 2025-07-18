import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { Shimmer } from "react-shimmer";
import QuizServices from "../../services/Quiz.services"; // adjust path as needed
import { FiDownload } from "react-icons/fi";
import * as XLSX from "xlsx";
export default function Leaderboard() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [allResults, setAllResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Call API via services
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await QuizServices.getLeaderboard();
        setAllResults(response.data || []);
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

  const filteredResults = allResults.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredResults.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredResults.length / rowsPerPage);

  if (loading) return <Shimmer width="100%" height={300} />;
  const exportToExcel = async () => {

    const Data = await QuizServices.getLeaderboard()
    const worksheet = XLSX.utils.json_to_sheet(Data.data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Recent_Attempts");
    XLSX.writeFile(workbook, "Recent_Quiz_Attempts.xlsx");
  };
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <main className="max-w-6xl mx-auto px-4 py-10 w-full">
        {/* Search */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-2xl text-gray-600">Players Leaderboard</h2>
          <div>
          <input
            type="text"
            placeholder="Search players..."
            className="w-full sm:w-80 border border-gray-300 rounded px-3 py-2 text-sm"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
                  <button className="bg-indigo-600 px-5 py-[6px] rounded-sm text-white ml-3" onClick={exportToExcel}>
Export All
        </button>

          </div>
        </div>


        {/* Table */}
        {currentRows.length ? (
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="w-full text-left text-sm">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="px-4 py-3">Rank</th>
                  <th className="px-4 py-3">Player</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Group</th>
                  <th className="px-4 py-3">Platform</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Answered</th>
                  <th className="px-4 py-3">Skipped</th>
                  <th className="px-4 py-3">Percentage</th>
                  <th className="px-4 py-3">Quiz</th>
                  <th className="px-4 py-3 hidden md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((r, i) => (
                  <tr
                    key={r.id}
                    className="odd:bg-gray-50 hover:bg-indigo-50 border-b"
                  >
                    <td className="px-4 py-2 font-bold">
                      {medal(indexOfFirstRow + i + 1)}
                    </td>
                    <td className="px-4 py-2">{r.name}</td>
                    <td className="px-4 py-2">{r.phone}</td>
                    <td className="px-4 py-2">{r.anbiyam || "--"}</td>
                    <td className="px-4 py-2">{r.score}</td>
                    <td className="px-4 py-2">{r.is_website===1?'Website':'Link'}</td>
                    <td className="px-4 py-2">{r.answered}</td>
                    <td className="px-4 py-2">{r.skipped}</td>
                    <td className="px-4 py-2">{r.percentage}%</td>
                    <td className="px-4 py-2">{r.quiz_title}</td>
                    <td className="px-4 py-2 hidden md:table-cell">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No leaderboard data found.</p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6 text-sm">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              &lt; Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              Next &gt;
            </button>
          </div>
        )}

        {/* Home link */}
        <div className="text-center mt-8">
          <Link to="/" className="text-indigo-600 underline">
            ← Return Home
          </Link>
        </div>
      </main>
    </div>
  );
}
