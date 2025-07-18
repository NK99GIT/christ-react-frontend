import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  MdChevronLeft, MdChevronRight,
  MdEdit, MdDelete, MdAdd
} from "react-icons/md";
import { Shimmer } from "react-shimmer";
import QuestionServices from "../../services/Question.services";

const ITEMS_PER_PAGE = 5;

const Questions = () => {
  const { quizId } = useParams();
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({ question: "", options: {}, correct_answer: "" });
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await QuestionServices.getByQuizId(quizId);
      setQuiz(res[0]);
      const ques = await QuestionServices.getAllByQuestionsBYId(quizId);
      setQuestions(ques);
    } catch (err) {
      console.error("Error fetching quiz questions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [quizId]);

  const openModal = (q = null) => {
    if (q) {
      setEditingId(q.id);
      setForm({ question: q.question, options: q.options, correct_answer: q.correct_answer });
    } else {
      setEditingId(null);
      setForm({ question: "", options: {}, correct_answer: "" });
    }
    setErrors({});
    setShowModal(true);
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleOptionChange = (key, value) => {
    setForm({ ...form, options: { ...form.options, [key]: value } });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.question.trim()) newErrors.question = "Question is required.";
    ["a", "b", "c", "d"].forEach((opt) => {
      if (!form.options[opt] || !form.options[opt].trim()) {
        newErrors[`option_${opt}`] = `Option ${opt.toUpperCase()} is required.`;
      }
    });
    if (!form.correct_answer) newErrors.correct_answer = "Please select the correct answer.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = { ...form, quiz_id: quizId };
    try {
      if (editingId) {
        await QuestionServices.update({ ...payload, id: editingId });
      } else {
        await QuestionServices.create(payload);
      }
      setShowModal(false);
      fetchQuestions();
    } catch (err) {
      console.error("Error submitting question", err);
    }
  };

  const confirmDelete = async () => {
    try {
      await QuestionServices.delete({ id: deleteId });
      setDeleteId(null);
      fetchQuestions();
    } catch (err) {
      console.error("Error deleting question", err);
    }
  };

  const filteredQuestions = questions.filter((q) =>
    q.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE);
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Questions for: {quiz?.title || "..."}</h2>
        <a href="/admin/quizzes" className="text-sm text-primary flex items-center gap-1 hover:underline">
          <MdChevronLeft /> Back to Quizzes
        </a>
      </div>

      <div className="flex justify-between items-center gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search questions..."
          className="flex-1 p-2 border rounded"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <button
          onClick={() => openModal()}
          className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded"
        >
          <MdAdd /> Add Question
        </button>
      </div>

      {!loading ? (
        paginatedQuestions.length ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm">
                <thead className="bg-indigo-600 text-white text-left">
                  <tr>
                    <th className="p-3 border-b-2">#</th>
                    <th className="p-3 border-b-2">Question</th>
                    <th className="p-3 border-b-2">Options</th>
                    <th className="p-3 border-b-2">Correct</th>
                    <th className="p-3 border-b-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedQuestions.map((q, i) => (
                    <tr key={q.id} className="bg-white border-b">
                      <td className="p-3 border-b">{(currentPage - 1) * ITEMS_PER_PAGE + i + 1}</td>
                      <td className="p-3 border-b">{q.question}</td>
                      <td className="p-3 border-b">
                        {Object.entries(q.options).map(([key, val]) => (
                          <div key={key}>
                            <span className="font-semibold">{key.toUpperCase()}:</span> {val}
                          </div>
                        ))}
                      </td>
                      <td className="p-2 border font-semibold text-green-600">
                        {q.correct_answer.toUpperCase()}
                      </td>
                      <td className="p-2 border flex gap-2">
                        <button onClick={() => openModal(q)}><MdEdit className="text-blue-500" /></button>
                        <button onClick={() => setDeleteId(q.id)}><MdDelete className="text-red-500" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end items-center gap-4 mt-4">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 px-3 py-1 border rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <MdChevronLeft /> Prev
              </button>
              <span className="text-sm">Page {currentPage} of {totalPages}</span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-1 px-3 py-1 border rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Next <MdChevronRight />
              </button>
            </div>
          </>
        ) : (
          <p className="text-textSecondary">No questions found for this quiz.</p>
        )
      ) : (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 border rounded-sm">
              <Shimmer height={20} width="80%" />
              <div className="mt-2 space-y-1">
                {[1, 2, 3, 4].map((j) => (
                  <Shimmer key={j} height={14} width={`${70 + j * 5}%`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-lg space-y-4">
            <h3 className="text-lg font-bold mb-2">{editingId ? "Edit" : "Add"} Question</h3>
            <div>
              <input
                type="text"
                placeholder="Question"
                value={form.question}
                onChange={(e) => handleChange("question", e.target.value)}
                className="w-full p-2 border rounded"
              />
              {errors.question && <p className="text-red-600 text-sm mt-1">{errors.question}</p>}
            </div>
            {["a", "b", "c", "d"].map((opt) => (
              <div key={opt}>
                <input
                  type="text"
                  placeholder={`Option ${opt.toUpperCase()}`}
                  value={form.options[opt] || ""}
                  onChange={(e) => handleOptionChange(opt, e.target.value)}
                  className="w-full p-2 border rounded"
                />
                {errors[`option_${opt}`] && <p className="text-red-600 text-sm">{errors[`option_${opt}`]}</p>}
              </div>
            ))}
            <div>
              <select
                value={form.correct_answer}
                onChange={(e) => handleChange("correct_answer", e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Correct Answer</option>
                {["a", "b", "c", "d"].map((opt) => (
                  <option key={opt} value={opt}>{opt.toUpperCase()}</option>
                ))}
              </select>
              {errors.correct_answer && <p className="text-red-600 text-sm mt-1">{errors.correct_answer}</p>}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
                {editingId ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md space-y-4 w-full max-w-md">
            <p className="text-lg font-semibold">Are you sure you want to delete this question?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button onClick={confirmDelete} className="bg-red-600 text-white px-4 py-2 rounded">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Questions;
