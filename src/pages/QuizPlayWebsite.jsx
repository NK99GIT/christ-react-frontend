import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdArrowBack } from "react-icons/md";
import QuestionServices from "../services/Question.services";
import QuizServices from "../services/Quiz.services";
import Logo from "../assets/Images/1.png";
import Logo2 from "../assets/Images/22.png";
import Swal from "sweetalert2";
import LoginBackground from "../assets/Images/us.png";

const slide = {
  hidden: (dir) => ({ x: dir > 0 ? 120 : -120, opacity: 0 }),
  show: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -120 : 120, opacity: 0 }),
};

export default function QuizPlayWebsite() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [idx, setIdx] = useState(0);
  const [EncStart, setEncStart] = useState(0);
  const [EncEnd, setEncEnd] = useState(0);
  const [EncID, setEncID] = useState(0);
  const [EncKeyword, setEncKeyword] = useState(0);
  const [EncTitle, setEncTitle] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [time, setTime] = useState(0);
  const [EncPhone, SetEncPhone] = useState(0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [UserScorePercentage, setUserScorePercentage] = useState(0);

  const [form, setForm] = useState({ anbiyam: '', name: "", keyword: "", phone: "", timer: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.anbiyam.trim()) errs.anbiyam = "Anbiyam is required";
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.keyword.trim()) errs.keyword = "Keyword is required";
    if (!/^\d{10}$/.test(form.phone)) errs.phone = "Valid phone number required";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleStart = async (e) => {
    e.preventDefault();
    const errs = validate();

    if (form.keyword.trim() && EncKeyword !== form.keyword.trim()) {
      errs.keyword = "Keyword is mismatch";
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const decodedTitle = EncTitle;
      const quizId = EncID;
      const limit = EncEnd;
      const offset = EncStart;

      const questionsData = {
        quizId,
        limit,
        offset,
        phone: form.phone
      };

      const res = await QuestionServices.getByQuestionsBYId(questionsData);
      let data = res;

      if (data !== "Already Extis") {
        const transformed = data.map((q) => {
          const optionsMap = {
            option1: q.options.a,
            option2: q.options.b,
            option3: q.options.c,
            option4: q.options.d,
          };
          const correctMap = { a: "option1", b: "option2", c: "option3", d: "option4" };
          return {
            ...q,
            ...optionsMap,
            correct: correctMap[q.correct_answer],
          };
        });

        const allQ = [...transformed];

        // Shuffle questions
        for (let i = allQ.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [allQ[i], allQ[j]] = [allQ[j], allQ[i]];
        }

        // Shuffle options
        allQ.forEach((q) => {
          const keys = ["option1", "option2", "option3", "option4"];
          for (let i = keys.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [q[keys[i]], q[keys[j]]] = [q[keys[j]], q[keys[i]]];

            if (q.correct === keys[i]) q.correct = keys[j];
            else if (q.correct === keys[j]) q.correct = keys[i];
          }
        });

        setQuiz({ title: decodedTitle, questionsList: allQ });

        const quizTimeInSeconds = parseInt(form.timer) * 60;
        setTime(quizTimeInSeconds);
      } else {
        showConfirm();
      }
    } catch (err) {
      console.error("Quiz fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const res = await QuestionServices.getQuizPlayDetails(atob(id));
      setEncStart(res[0].limit);
      setEncEnd(res[0].offset);
      setEncID(res[0].quiz_id);
      setEncKeyword(res[0].keyword);
      setEncTitle(res[0].quiz_play_name);
      setForm((prev) => ({ ...prev, keyword: res[0].keyword }));
    })();
  }, []);

  useEffect(() => {
    if (!quiz || done) return;

    const perQuestionTime = parseInt(form.timer) || 30;
    setTime(perQuestionTime);

    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (idx + 1 < quiz.questionsList.length) {
            setIdx((prevIdx) => prevIdx + 1);
          } else {
            finish();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [idx, quiz, done, form.timer]);

  const total = quiz?.questionsList?.length || 0;
  const curQ = quiz?.questionsList[idx] || {};
  const curAns = answers[idx] ?? null;

  const select = (key) => {
    const upd = [...answers];
    upd[idx] = key;
    setAnswers(upd);
  };

  const handlePrev = () => idx > 0 && setIdx(idx - 1);
  const handleNext = () => (idx + 1 < total ? setIdx(idx + 1) : finish());
  const handleSkip = () => handleNext();

  const score = answers.reduce((c, a, i) => (a === quiz?.questionsList?.[i].correct ? c + 1 : c), 0);

  const showConfirm = () => {
    Swal.fire({
      title: "warning",
      text: "You have already completed the quiz with this phone number. Please use a different number",
      imageUrl: Logo,
      imageAlt: 'Warning icon',
      imageWidth: 100,
      imageHeight: 100,
      background: '#1e293b',
      color: '#ffffff',
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonColor: "#3085d6",
      cancelButtonText: "Cancel",
    });
  };

  const finish = async () => {
    setDone(true);
    const correctAnswers = answers.reduce((count, ans, i) => (
      ans === quiz?.questionsList[i]?.correct ? count + 1 : count
    ), 0);

    const answered = answers.filter((a) => a !== undefined && a !== null).length;
    const skipped = total - answered;
    const percentage = Number(((correctAnswers / total) * 100).toFixed(2));
    setUserScorePercentage(percentage);
    const encodedPhone = form.phone;
    SetEncPhone(encodedPhone);

    const payload = {
      anbiyam: form.anbiyam,
      name: form.name,
      phone: form.phone,
      score,
      total,
      percentage,
      answered,
      quiz_title: EncTitle,
      skipped,
      quiz_id: EncID,
      is_website: 1,
    };

    try {
      // if (percentage >= 85) {
        await QuizServices.saveResult(payload);
      // }
    } catch (err) {
      console.error("Failed to save result:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      {!quiz ? (
        <div className="min-h-screen flex items-center justify-center p-0 bg-gray-200">
          <div className="hidden md:block md:w-1/2 min-h-screen bg-cover bg-no-repeat" style={{ backgroundImage: `url(${LoginBackground})` }} />
          <div className="w-full md:w-1/2 ">
            <img src={Logo2} className="w-[150px] mx-auto" alt="Logo" />
            <form
              onSubmit={handleStart}
              className="bg-white rounded-sm shadow-w-full max-w-[500px] space-y-6 flex justify-center flex-col mx-auto"
            >
              <div className="bg-gradient-to-r from-primary to-purpleAccent py-2 px-6 rounded-tl-sm rounded-tr-sm">
                <p className="text-white text-center text-3xl font-bold">LITTLE MOUNT</p>
              </div>
              <p className="text-black text-center text-lg mt-1 font-bold">{EncTitle}</p>

              <div className="px-8 pb-8">
                {["anbiyam", "name", "phone"].map((field) => (
                  <div className="pb-4" key={field}>
                    <label className="block mb-1 font-medium capitalize">
                      {field} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name={field}
                      value={form[field]}
                      onChange={handleChange}
                      className="w-full border rounded p-2"
                    />
                    {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
                  </div>
                ))}
                <div className="pb-4">
                  <label className="block mb-1 font-medium">Keyword<span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="keyword"
                    value={form.keyword}
                    disabled
                    className="w-full border rounded p-2"
                  />
                  {errors.keyword && <p className="text-red-500 text-sm mt-1">{errors.keyword}</p>}
                </div>
                <div className="pb-4">
                  <label className="block mb-1 font-medium">Select Timer (Per Question)<span className="text-red-500">*</span></label>
                  <div className="flex gap-6">
                    {["30", "25"].map((val) => (
                      <label key={val} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="timer"
                          value={val}
                          checked={form.timer === val}
                          onChange={handleChange}
                          className="form-radio"
                        />
                        {val} Seconds
                      </label>
                    ))}
                  </div>
                </div>
                <button type="submit" className="w-full bg-primary text-white py-2 rounded hover:bg-blue-600">
                  Start Quiz
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <QuizUI {...{ quiz, idx, time, total, curQ, curAns, select, handlePrev, handleNext, handleSkip, finish, UserScorePercentage, score, EncID, EncPhone, navigate, done }} />
      )}
    </div>
  );
}

function QuizUI({ quiz, idx, time, total, curQ, curAns, select, handlePrev, handleNext, handleSkip, finish, UserScorePercentage, score, EncID, EncPhone, navigate, done }) {
  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow">
        <div className="px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-textSecondary hover:text-primary">
            <MdArrowBack /> Quit
          </button>
          <h2 className="font-semibold text-textPrimary truncate">{quiz.title} • {idx + 1}/{total}</h2>
          <span className="font-mono px-3 py-1 rounded bg-warning text-white">
            {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
          </span>
        </div>
        <div className="h-1 bg-gray-200">
          <div className="h-full bg-primary transition-all" style={{ width: ((idx + 1) / total) * 100 + "%" }} />
        </div>
      </header>

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
                    className={`w-full text-left px-4 py-3 border rounded-sm transition ${
                      curAns === k ? "border-primary bg-primary/10" : "border-gray-200 hover:bg-primary/5"
                    }`}
                  >
                    {curQ[k]}
                  </button>
                ))}
              </div>

              <footer className="sticky bottom-0 bg-white shadow-sm px-4 py-3 flex justify-between gap-4">
                <button
                  onClick={handlePrev}
                  disabled={idx === 0}
                  className={`px-5 py-2 rounded-full ${idx === 0 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-bg hover:bg-gray-100"}`}
                >
                  Back
                </button>
                <div className="flex gap-5">
                  <button onClick={handleSkip} className="px-5 py-2 rounded-full bg-warning/20 text-warning hover:bg-warning/30">
                    Skip
                  </button>
                  {idx + 1 < total ? (
                    <button
                      onClick={handleNext}
                      disabled={curAns == null}
                      className={`px-5 py-2 rounded-full ${
                        curAns == null ? "bg-primary/40 text-white cursor-not-allowed" : "bg-primary text-white hover:bg-blue-600"
                      }`}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={finish}
                      disabled={curAns == null}
                      className={`px-5 py-2 rounded-full ${
                        curAns == null ? "bg-success/40 text-white cursor-not-allowed" : "bg-success text-white hover:bg-green-600"
                      }`}
                    >
                      Finish
                    </button>
                  )}
                </div>
              </footer>
            </motion.div>
          ) : (
            <motion.div
              key={UserScorePercentage >= 85 ? "result-pass" : "result-fail"}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-lg bg-white rounded-sm shadow-xl p-10 text-center space-y-6"
            >
              <h2 className="text-3xl font-extrabold text-primary">
                {UserScorePercentage >= 85 ? "Quiz Completed!" : "Thanks for Participating!"}
              </h2>
              <p className="text-lg text-textPrimary">
                You scored <span className="font-bold">{score}</span> / {total}
              </p>
              <button
                onClick={() =>
                  UserScorePercentage >= 85
                    ? navigate(`/certificate/${btoa(EncID)}/${btoa(EncPhone)}`)
                    : navigate("/")
                }
                className="bg-primary text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                {UserScorePercentage >= 85 ? "View Certificate" : "Home"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
