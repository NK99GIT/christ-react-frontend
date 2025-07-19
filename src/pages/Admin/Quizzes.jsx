import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  MdAdd,MdPreview, MdEdit, MdDelete, MdVisibility,MdHistoryEdu, MdContentCopy,
} from "react-icons/md";
import { Shimmer } from "react-shimmer";
import QuizServices from "../../services/Quiz.services";
import Swal from "sweetalert2"; 
import Logo from "../../assets/Images/1.png";
  import {toast } from 'react-toastify';



const Backdrop = ({ children, onClose }) => (
  <motion.div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
    <motion.div onClick={(e) => e.stopPropagation()}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-white rounded-sm shadow-xl w-full max-w-lg p-8"
    >
      {children}
    </motion.div>
  </motion.div>
);

const createQuizPlay = async (quizPlayData) => {
  try {
    const res = await QuizServices.createQuizPlay(quizPlayData);
      toast.success('🦄 Quiz Play Created !', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    console.log("Quiz play created:", res.data);
    // Optionally show a success message or redirect
  } catch (err) {
    console.error("Failed to create quiz play", err);
    // Optionally show an error message
  } finally {
  }
};

export default function Quizzes() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoad] = useState(true);
  const [edit, setEdit] = useState(null);
  const [confirm, setConf] = useState(null);
  const [copyModal, setCopyModal] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const fetchData = async () => {
    setLoad(true);
    try {
      const res = await QuizServices.getAll();
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

  const filtered = data.filter(
    (q) =>
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.category.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleSave = async (f) => {
    try {
      if (f.id) await QuizServices.update(f);
      else {
        const data = await QuizServices.create(f);
        if (data.data.id) {
          navigate(`/admin/questions/${data.data.id}`)
        }
      }
      fetchData();
      setEdit(null);
    } catch (err) {
      console.error("Failed to save quiz", err);
    }
  };

  const handleDel = async (id) => {
    try {
      await QuizServices.remove(id);
      fetchData();
      setConf(null);
    } catch (err) {
      console.error("Failed to delete quiz", err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Search questions..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="flex-grow border rounded-sm px-4 py-2 shadow-sm"
        />
        <button
          onClick={() => setEdit({ title: "", category: "", questions: 1 })}
          className="bg-blue-600 text-white px-4 py-2 rounded-sm hover:bg-blue-700"
        >
          + Add Quiz
        </button>
      </div>

      <div className="overflow-x-auto bg-white">
        <table className="min-w-full border text-sm">
          <thead className="bg-indigo-600 text-white text-left">
            <tr>
              <th className="p-3 border-b-2">Title</th>
              <th className="p-3 border-b-2">Category</th>
              <th className="p-3 border-b-2">Questions</th>
              <th className="p-3 border-b-2">Actions</th>
            </tr>
          </thead>
          {!loading ? (
            <tbody>
              {paginated.map((q) => (
                <tr key={q.id} className="odd:bg-gray-50">
                  <td className="p-3 border-b-2">{q.title}</td>
                  <td className="p-3 border-b-2">{q.category}</td>
                  <td className="p-3 border-b-2">{q.question_count}</td>
                  <td className="p-3 border-b-2">
                    <div className="flex items-center gap-3">
                      <button title="Create Quiz Play" className="text-blue-500 hover:text-blue-400" onClick={() => setCopyModal(q)}>
                        <MdAdd />
                      </button>
                      <button title="View Quiz Play"
                        className="text-purple-600 hover:text-purple-500"
                        onClick={() => navigate(`/admin/quizplaylist/${btoa(q.id)}`)}
                      >
                        <MdVisibility />
                      </button>
                      <button title="View All Questions" className="text-purple-600 hover:text-purple-500"
                        onClick={() => navigate(`/admin/questions/${q.id}`)}>
                        <MdHistoryEdu />
                      </button>
                      <button title="Edit" className="text-yellow-600 hover:text-yellow-500" onClick={() => setEdit(q)}>
                        <MdEdit />
                      </button>
                      <button title="Delete" className="text-red-600 hover:text-red-500" onClick={() => setConf(q.id)}>
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!paginated.length && (
                <tr><td colSpan={4} className="text-center py-6">No quizzes found.</td></tr>
              )}
            </tbody>
          ) : (
            <tbody>{Array.from({ length: 10 }).map((_, i) => (
              <tr key={i}><td colSpan={4} className="px-3 py-2"><Shimmer width="100%" height={20} /></td></tr>
            ))}</tbody>
          )}
        </table>
      </div>

      <div className="flex justify-end items-center gap-4 text-sm">
        <button
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Prev
        </button>
        <span>Page {currentPage} of {totalPages || 1}</span>
        <button
          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>

      <AnimatePresence>
        {edit && (
          <Backdrop onClose={() => setEdit(null)}>
            <QuizForm quiz={edit} onSave={handleSave} onCancel={() => setEdit(null)} />
          </Backdrop>
        )}
        {confirm && (
          <Backdrop onClose={() => setConf(null)}>
            <ConfirmDelete onConfirm={() => handleDel(confirm)} onCancel={() => setConf(null)} />
          </Backdrop>
        )}
        {copyModal && (
          <Backdrop onClose={() => setCopyModal(null)}>
            <CopyLinkModal quiz={copyModal} onClose={() => setCopyModal(null)} />
          </Backdrop>
        )}
      </AnimatePresence>
    </div>
  );
}

// ✅ VALIDATED QuizForm
function QuizForm({ quiz, onSave, onCancel }) {
  const [f, setF] = useState(quiz);
  const [errors, setErrors] = useState({});

  const h = (e) => {
    const { name, value } = e.target;
    setF({ ...f, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!f.title.trim()) newErrors.title = "Title is required";
    if (!f.category.trim()) newErrors.category = "Category is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSave(f);
  };

  return (
    <>
      <h2 className="text-lg font-bold mb-4">{f.id ? "Edit" : "Add"} Quiz</h2>
      <div className="space-y-3">
        <div>
          <input name="title" value={f.title} onChange={h} placeholder="Title"
            className="w-full border rounded-sm px-4 py-2" />
          {errors.title && <p className="text-red-600 text-sm">{errors.title}</p>}
        </div>
        <div>
          <input name="category" value={f.category} onChange={h} placeholder="Category"
            className="w-full border rounded-sm px-4 py-2" />
          {errors.category && <p className="text-red-600 text-sm">{errors.category}</p>}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button onClick={onCancel}
          className="px-4 py-2 rounded-sm bg-gray-100 border">Cancel</button>
        <button onClick={handleSubmit}
          className="px-4 py-2 rounded-sm bg-primary text-white hover:ring-2 hover:ring-primary/40">Save</button>
      </div>
    </>
  );
}

// ✅ ConfirmDelete (No Change)
function ConfirmDelete({ onConfirm, onCancel }) {
  return (
    <>
      <h2 className="text-lg font-bold text-error mb-4 flex items-center gap-2"><MdDelete /> Delete Quiz?</h2>
      <p className="text-gray-500 mb-6">This action cannot be undone. Continue?</p>
      <div className="flex justify-end gap-3">
        <button onClick={onCancel}
          className="px-4 py-2 rounded-sm bg-gray-100 border">Cancel</button>
        <button onClick={onConfirm}
          className="px-4 py-2 rounded-sm bg-red-600 text-white hover:ring-2 hover:ring-error/40">Delete</button>
      </div>
    </>
  );
}

// ✅ VALIDATED CopyLinkModal
function CopyLinkModal({ quiz, onClose }) {
  const [limit, setLimit] = useState(0);
  const [QuizPlayName, setQuizPlayName] = useState('');
  const [offset, setOffset] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [expTime, setexpTime] = useState(1);
  const [error, setError] = useState("");

  const generateLink = () => {
    if (limit > offset) {
      setError("Start value cannot be greater than End value.");
      return;
    } else if (QuizPlayName.length === 0) {
      setError("Quiz Play Name is Required");
      return
    }
    else if (keyword.length === 0) {
      setError("Keyword is Required");
      return
    }

    setError("");
    const EncLimit = btoa(limit.toString());
    const EncOffset = btoa(offset.toString());
    const encKeyword = btoa(keyword || "default");
    const encQuizId = btoa(quiz.id.toString());
    const encQuizTitle = btoa(quiz.title || "Untitled Quiz");

    const formatISTDateTime = (date) => {
      const offset = 5.5 * 60 * 60 * 1000; // IST offset in ms
      const istDate = new Date(date.getTime() + offset);
      return istDate.toISOString().slice(0, 19).replace("T", " ");
    };


    const validUntil = formatISTDateTime(new Date(Date.now() + expTime * 60 * 60 * 1000)); // hours to ms
    const currentDomain = window.location.hostname;
    console.log(currentDomain)

    let PlayData = {
      quiz_id: quiz.id,
      keyword: keyword,
      quiz_play_name: QuizPlayName,
      offset: offset,
      limit: limit,
      valid_time: validUntil,
      link:`http://${currentDomain}/quizplay/${encQuizId}/${encQuizTitle}/${encKeyword}/${EncLimit}/${EncOffset}`,
    };

    createQuizPlay(PlayData); 
   onClose();

  };
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Create Quiz Link</h2>
      {error && <p className="text-red-600 text-md font-bold text-center">{error}</p>}
      <label className="block mb-1 font-medium">TITLE</label>

      <input value={QuizPlayName}  onChange={(e) => setQuizPlayName(e.target.value)} className="w-full p-2 border rounded" />
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block mb-1 font-medium">START</label>
          <input type="number" min={1} value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="w-full p-2 border rounded" />
        </div>
        <div className="flex-1">
          <label className="block mb-1 font-medium">No of Questions</label>
          <input type="number" min={0} value={offset}
            onChange={(e) => setOffset(Number(e.target.value))}
            className="w-full p-2 border rounded" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block mb-1 font-medium">KEYWORD</label>
          <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)}
            className="w-full p-2 border rounded" placeholder="Enter keyword" />
        </div>
        <div className="flex-1">
          <label className="block mb-1 font-medium">Expire Time(hrs)</label>
          <input type="number" value={expTime} onChange={(e) => setexpTime(e.target.value)}
            className="w-full p-2 border rounded" placeholder="Enter Expire Time Default (1 hrs)" />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 rounded-sm bg-gray-100 border">Cancel</button>
        <button onClick={generateLink} className="px-4 py-2 rounded-sm bg-blue-600 text-white hover:ring-2 hover:ring-primary/40">Copy Link</button>
      </div>
    </div>
  );
}
