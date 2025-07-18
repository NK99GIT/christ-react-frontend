import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdArrowBack } from "react-icons/md";

const SECONDS_PER_QUESTION = 60;

/* slide-left / slide-right animation */
const slide = {
  hidden: (dir) => ({ x: dir > 0 ? 120 : -120, opacity: 0 }),
  show:   { x: 0, opacity: 1 },
  exit:   (dir) => ({ x: dir > 0 ? -120 : 120, opacity: 0 }),
};

export default function PracticeMode() {
  const { quizId } = useParams();
  const navigate   = useNavigate();

  /* ─── state ─── */
  const [quiz,    setQuiz]    = useState(null);
  const [idx,     setIdx]     = useState(0);                 // current Q index
  const [answers, setAnswers] = useState([]);                // user answers
  const [time,    setTime]    = useState(SECONDS_PER_QUESTION);
  const [done,    setDone]    = useState(false);

  /* ─── LOAD + SHUFFLE once ─── */
  useEffect(() => {
    const all = JSON.parse(localStorage.getItem("quizzes") || "[]");
    const raw = all.find((q) => q.id == quizId);

    if (!raw) {
      navigate("/", { replace: true });
      return;
    }

    // shuffle questions
    const list = [...raw.questionsList];
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }

    // optional: shuffle options inside each question
    list.forEach((q) => {
      const keys = ["option1", "option2", "option3", "option4"];
      for (let i = keys.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [q[keys[i]], q[keys[j]]] = [q[keys[j]], q[keys[i]]];
        if (q.correct === keys[i]) q.correct = keys[j];
        else if (q.correct === keys[j]) q.correct = keys[i];
      }
    });

    setQuiz({ ...raw, questionsList: list });
  }, [quizId, navigate]);

  /* ─── timer per question ─── */
  useEffect(() => {
    if (!quiz || done) return;
    setTime(SECONDS_PER_QUESTION);
    const t = setInterval(() => setTime((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [idx, quiz, done]);

  /* auto-next on 0 */
  useEffect(() => {
    if (time === 0 && !done) handleNext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  /* ------ helpers that don't use hooks ------ */
  const total  = quiz?.questionsList.length || 0;
  const curQ   = quiz?.questionsList[idx]   || {};
  const curAns = answers[idx] ?? null;

  const select = (key) => {
    const upd      = [...answers];
    upd[idx]       = key;
    setAnswers(upd);
  };

  const handlePrev = () => idx > 0 && setIdx(idx - 1);

  const handleNext = () => {
    if (idx + 1 < total) setIdx(idx + 1);
    else finish();
  };

  const handleSkip = () => handleNext();   // leave answer undefined

  const finish = () => setDone(true);

  const score = answers.reduce(
    (c, a, i) => (a === quiz?.questionsList?.[i].correct ? c + 1 : c),
    0
  );

  /* guard while quiz not yet loaded */
  if (!quiz) return null;

  /* ─── UI ─── */
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      {/* ===== Header ===== */}
      <header className="sticky top-0 z-50 bg-white shadow">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-textSecondary hover:text-primary"
          >
            <MdArrowBack /> Quit
          </button>
          <h2 className="font-semibold text-textPrimary truncate">
            {quiz.title} • {idx + 1}/{total}
          </h2>
          <span className="font-mono px-3 py-1 rounded bg-warning text-white">
            {time}s
          </span>
        </div>
        {/* progress bar */}
        <div className="h-1 bg-gray-200">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: ((idx + 1) / total) * 100 + "%" }}
          />
        </div>
      </header>

      {/* ===== Question | Result ===== */}
      <div className="flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div
              key={idx}
              custom={idx}
              variants={slide}
              initial="hidden"
              animate="show"
              exit="exit"
              transition={{ duration: 0.35 }}
              className="w-full max-w-2xl bg-white rounded-sm shadow-md p-8 space-y-6"
            >
              <h3 className="text-lg font-bold text-textPrimary">{curQ.question}</h3>

              <div className="space-y-3">
                {["option1", "option2", "option3", "option4"].map((k) => (
                  <button
                    key={k}
                    onClick={() => select(k)}
                    className={`w-full text-left px-4 py-3 border rounded-sm transition
                      ${
                        curAns === k
                          ? "border-primary bg-primary/10"
                          : "border-gray-200 hover:bg-primary/5"
                      }`}
                  >
                    {curQ[k]}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-lg bg-white rounded-sm shadow-xl p-10 text-center space-y-6"
            >
              <h2 className="text-3xl font-extrabold text-primary">Practice Finished!</h2>
              <p className="text-lg text-textPrimary">
                You scored <span className="font-bold">{score}</span> / {total}
              </p>
              <button
                onClick={() => {
                  setIdx(0);
                  setAnswers([]);
                  setDone(false);
                  navigate('/login')
                }}
                className="bg-primary text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                Lets Start
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ===== Footer Nav (hidden on result) ===== */}
      {!done && (
        <footer className="sticky bottom-0 bg-white border-t shadow-sm px-4 py-3 flex justify-between gap-4">
          {/* Prev */}
          <button
            onClick={handlePrev}
            disabled={idx === 0}
            className={`px-5 py-2 rounded-full ${
              idx === 0
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-bg hover:bg-gray-100"
            }`}
          >
            Back
          </button>

          {/* Skip */}
          <button
            onClick={handleSkip}
            className="px-5 py-2 rounded-full bg-warning/20 text-warning hover:bg-warning/30 transition"
          >
            Skip
          </button>

          {/* Next / Finish */}
          {idx + 1 < total ? (
            <button
              onClick={handleNext}
              disabled={curAns == null && time > 0}
              className={`px-5 py-2 rounded-full ${
                curAns == null && time > 0
                  ? "bg-primary/40 text-white cursor-not-allowed"
                  : "bg-primary text-white hover:bg-blue-600"
              }`}
            >
              Next
            </button>
          ) : (
            <button
              onClick={finish}
              disabled={curAns == null && time > 0}
              className={`px-5 py-2 rounded-full ${
                curAns == null && time > 0
                  ? "bg-success/40 text-white cursor-not-allowed"
                  : "bg-success text-white hover:bg-green-600"
              }`}
            >
              Finish
            </button>
          )}
        </footer>
      )}
    </div>
  );
}
