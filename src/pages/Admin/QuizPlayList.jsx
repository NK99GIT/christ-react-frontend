import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdDelete, MdContentCopy } from "react-icons/md";
import { Shimmer } from "react-shimmer";
import { AnimatePresence, motion } from "framer-motion";
import QuizServices from "../../services/Quiz.services";
import { ToastContainer, toast } from 'react-toastify';

const Backdrop = ({ children, onClose }) => (
  <motion.div
    className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div
      onClick={(e) => e.stopPropagation()}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-white rounded-sm shadow-xl w-full max-w-lg p-8"
    >
      {children}
    </motion.div>
  </motion.div>
);

export default function QuizPlayList() {
  const [data, setData] = useState([]);
  const [loading, setLoad] = useState(true);
  const [confirm, setConf] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;
  const { id } = useParams();
  const fetchData = async () => {
    setLoad(true);

    try {
      const ids = {
        id: atob(id)
      }
      const res = await QuizServices.getQuizPlay(ids);
      setData(res.data);
    } catch (err) {
      console.error("Failed to load quizzes", err);
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalPages = Math.ceil(data.length / perPage);
  const paginated = data.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleDel = async (id) => {
    const ids = {
      id: id
    }
    try {
      await QuizServices.deleteQuizPlay(ids); // ensure this endpoint is correct
      fetchData();
      setConf(null);
    } catch (err) {
      console.error("Failed to delete quiz play", err);
    }
  };

const CopyLink = (link,id) => {
  const textarea = document.createElement("textarea");
  const url = `${link}/${btoa(id)}`;
  textarea.value = url;
  console.log(textarea.value)
  document.body.appendChild(textarea);
  textarea.select();
  try {
    const successful = document.execCommand("copy");
    if (successful) {
      toast.success('Copied!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      throw new Error("Copy command failed");
    }
  } catch (err) {
    console.error("Fallback: Copy failed", err);
    toast.error('Failed to copy!', {
      position: "top-right",
      theme: "colored",
    });
  }
  document.body.removeChild(textarea);
};


  return (
    <div className="space-y-8">
      <div className="overflow-x-auto bg-white">
        <table className="min-w-full border text-sm">
          <thead className="bg-indigo-600 text-white text-left">
            <tr>
              <th className="p-3 border-b-2">Quiz Play Name</th>
              <th className="p-3 border-b-2">Keyword</th>
              <th className="p-3 border-b-2">Expire Time</th>
              <th className="p-3 border-b-2">Actions</th>
            </tr>
          </thead>
          {!loading ? (
            <tbody>
              {paginated.map((q) => (
                <tr key={q.id} className="odd:bg-gray-50">
                  <td className="p-3 border-b-2">{q.quiz_play_name}</td>
                  <td className="p-3 border-b-2">{q.keyword}</td>
                  <td className="p-3 border-b-2">
                    {new Date(q.valid_time).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit"
                    })}
                  </td>
                  <td className="p-3 border-b-2">
                    <div className="flex items-center gap-3">
                      <button title="Create Quiz Play" className="text-blue-500 hover:text-blue-400" onClick={() => CopyLink(q.link,q.id)}>
                        <MdContentCopy />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-500"
                        onClick={() => setConf(q.id)}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!paginated.length && (
                <tr>
                  <td colSpan={4} className="text-center py-6">No quiz plays found.</td>
                </tr>
              )}
            </tbody>
          ) : (
            <tbody>
              {Array.from({ length: 10 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={4} className="px-3 py-2">
                    <Shimmer width="100%" height={20} />
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      <div className="flex justify-end items-center gap-4 text-sm">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Prev
        </button>
        <span>Page {currentPage} of {totalPages || 1}</span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>

      <AnimatePresence>
        {confirm && (
          <Backdrop onClose={() => setConf(null)}>
            <ConfirmDelete onConfirm={() => handleDel(confirm)} onCancel={() => setConf(null)} />
          </Backdrop>
        )}
      </AnimatePresence>
    </div>
  );
}

function ConfirmDelete({ onConfirm, onCancel }) {
  return (
    <>
      <h2 className="text-lg font-bold text-error mb-4 flex items-center gap-2">
        <MdDelete /> Delete Quiz Play?
      </h2>
      <p className="text-gray-500 mb-6">This action cannot be undone. Continue?</p>
      <div className="flex justify-end gap-3">
        <button onClick={onCancel} className="px-4 py-2 rounded-sm bg-gray-100 border">Cancel</button>
        <button onClick={onConfirm} className="px-4 py-2 rounded-sm bg-red-600 text-white hover:ring-2 hover:ring-error/40">Delete</button>
      </div>
    </>
  );
}
