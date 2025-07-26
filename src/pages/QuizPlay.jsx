import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdArrowBack } from "react-icons/md";
import QuestionServices from "../services/Question.services";
import QuizServices from "../services/Quiz.services";
import Logo from "../assets/Images/1.png";
import LogowithText from "../assets/Images/logo-with-black.png";
import LogowithTextWhite from "../assets/Images/logo-with-white.png";
import Logo2 from "../assets/Images/22.png";
import Swal from "sweetalert2"; 
import LoginBackground from "../assets/Images/us.png";

const slide = {
  hidden: (dir) => ({ x: dir > 0 ? 120 : -120, opacity: 0 }),
  show: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -120 : 120, opacity: 0 }),
};

export default function QuizPlay() {
  const { start, end, title, id, keyword } = useParams();
  const EncStart = atob(start);
  const EncEnd = atob(end);
  const EncID = atob(id);
  const EncTitle = atob(title);
  const EncKeyword = atob(keyword);
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [time, setTime] = useState(0);
  const [EncPhone, SetEncPhone] = useState(0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [totalTimeStarted, setTotalTimeStarted] = useState(false);
  const [UserScorePercentage, setUserScorePercentage] = useState(0);

  const [form, setForm] = useState({ anbiyam: '', name: "", keyword: "", phone: "", timer: "" });
  const [errors, setErrors] = useState({});
const [showExpired, setShowExpired] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.keyword.trim()) errs.keyword = "Keyword is required";
    if (!/^\d{10}$/.test(form.phone)) errs.phone = "Valid phone number required";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

const handlePlayClick = (valid_time) => {
  const now = new Date(); // current time in local timezone
  const valid = new Date(valid_time); // parsed from UTC ISO string

};


  const handleStart = async (e) => {
    e.preventDefault();

    const errs = validate();

    // Keyword match check
    if (form.keyword.trim() && EncKeyword !== form.keyword.trim()) {
      errs.keyword = "Keyword is mismatch";
    }

    // If any errors, block and show
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({}); // Clear old errors
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
        phone:form.phone
      };
      const res = await QuestionServices.getByQuestionsBYId(questionsData);
      let data = res; 
if(data !=="Already Extis"){
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

      // Shuffle options within each question
      allQ.forEach((q) => {
        const keys = ["option1", "option2", "option3", "option4"];
        for (let i = keys.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [q[keys[i]], q[keys[j]]] = [q[keys[j]], q[keys[i]]];

          // Adjust correct answer after shuffle
          if (q.correct === keys[i]) q.correct = keys[j];
          else if (q.correct === keys[j]) q.correct = keys[i];
        }
      });

      setQuiz({ title: decodedTitle, questionsList: allQ });

      const quizTimeInSeconds = parseInt(form.timer) * 60;
      setTime(quizTimeInSeconds);
      // setTotalTimeStarted(true)
    }
      else{
        showConfirm()
      }
    } catch (err) {
      console.error("Quiz fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

const isValid = async () => {
  const res2 = await QuestionServices.getQuizPlayDetails(5);
  const currentTime = new Date();
  const validTime = new Date(res2[0].valid_time);
  return currentTime > validTime; // true = valid, false = expired
};

useEffect(() => {
const valid = isValid(); 
if(valid){
validConfirm()
}

  if (!quiz || done) return;

  const perQuestionTime = parseInt(form.timer) || 30;
  setTime(perQuestionTime); // reset timer every time idx changes

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
  const handleNext = () => {
    if (idx + 1 < total) setIdx(idx + 1);
    else finish();
  };

  const handleSkip = () => handleNext();

  const score = answers.reduce(
    (c, a, i) => (a === quiz?.questionsList?.[i].correct ? c + 1 : c),
    0
  );

  
 const showConfirm = () => {
    Swal.fire({
      title: "warning",
      text: "You have already completed the quiz with this phone number. Please use a different number",
      imageUrl: LogowithText, // your custom image
      imageAlt: 'Warning icon',
      imageWidth: 250,
// imageHeight: 100,
  background: '#9013FE ',     // dark blue-gray background
  color: '#ffffff',  
      showCancelButton: true,        // red
      showConfirmButton: false,        // red
      cancelButtonColor: "#3085d6",      
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Your delete logic here
        Swal.fire("Deleted!", "Your item has been deleted.", "success");
      }
    });
  };
  
const validConfirm = () => {
  Swal.fire({
    title: "Warning",
    text: "The Quiz Play Expired. Please Visit Our Site",
    imageUrl: LogowithTextWhite,
    imageAlt: 'Warning icon',
    imageWidth: 250,
    background: '#9013FE',
    color: '#ffffff',
    showCancelButton: false,
    showConfirmButton: true,
    confirmButtonText: "Our Site",
    allowOutsideClick: false,  
    allowEscapeKey: false     
  }).then((result) => {
    if (result.isConfirmed) {
      navigate('/');
    }
  });
};


  const finish = async () => {
    setDone(true);
    const correctAnswers = answers.reduce(
      (count, ans, i) => (ans === quiz?.questionsList[i]?.correct ? count + 1 : count),
      0
    );

    const answered = answers.filter((a) => a !== undefined && a !== null).length;
    const skipped = total - answered;
    const percentage = Number(((correctAnswers / total) * 100).toFixed(2));
    setUserScorePercentage(percentage) 
    const payload = {
      anbiyam: form.anbiyam,
      name: form.name,
      phone: form.phone,
      score,
      total,
      percentage,
      answered: answered,
      quiz_title: EncTitle,
      skipped: skipped,
      quiz_id: EncID,
    };
 const encodedPhone = (form.phone);
  SetEncPhone(encodedPhone);
    try {
      // if (percentage >= 85) {
        await QuizServices.saveResult(payload);
      // } 

    } catch (err) {
      console.error("Failed to save result:", err);
    }
  };



  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center p-0 bg-gray-200">
<div className="hidden md:block md:w-1/2 min-h-screen bg-cover bg-no-repeat"   style={{ backgroundImage: `url(${LoginBackground})` }}>
 
        </div>
<div className="w-full md:w-1/2 ">
<img src={LogowithText} className="w-[150px] mx-auto mb-4" alt="Logo" />
        <form
          onSubmit={handleStart}
          className="bg-white rounded-sm shadow-w-full max-w-[500px] space-y-6 flex justify-center flex-col mx-auto"
        >
          <div className="bg-gradient-to-r from-primary to-purpleAccent py-2 px-6 rounded-tl-sm rounded-tr-sm">
           
            <p className="text-white text-center text-md mt-1 font-bold text-3xl">LITTLE MOUNT</p>
          </div>
          <p className="text-black text-center text-lg mt-1 font-bold">{EncTitle}</p>

          <div className="px-8 pb-8">
            <div className="pb-4">
              <label className="block mb-1 font-medium">Anbiyam<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="anbiyam"
                value={form.anbiyam}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
              {errors.anbiyam && <p className="text-red-500 text-sm mt-1">{errors.anbiyam}</p>}
            </div>

            <div className="pb-4">
              <label className="block mb-1 font-medium">Name<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div className="pb-4">
              <label className="block mb-1 font-medium">Keyword<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="keyword"
                value={form.keyword}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
              {errors.keyword && <p className="text-red-500 text-sm mt-1">{errors.keyword}</p>}
            </div>

            <div className="pb-4">
              <label className="block mb-1 font-medium">Phone Number<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

<div className="pb-4">
  <label className="block mb-1 font-medium">Select Timer(Per Question)<span className="text-red-500">*</span></label>
  <div className="flex gap-6">
    <label className="flex items-center gap-2">
      <input
        type="radio"
        name="timer"
        value="30"
        checked={form.timer === "30"}
        onChange={handleChange}
        className="form-radio"
      />
      30 Seconds
    <span className="text-red-500"></span></label>
    <label className="flex items-center gap-2">
      <input
        type="radio"
        name="timer"
        value="25"
        checked={form.timer === "25"}
        onChange={handleChange}
        className="form-radio"
      />
      25 Seconds
    <span className="text-red-500"></span></label>
  </div>
</div>


            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded hover:bg-blue-600"
            >
              Start Quiz
            </button>
          </div>
        </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg">
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
            {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
          </span>
        </div>
        <div className="h-1 bg-gray-200">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: ((idx + 1) / total) * 100 + "%" }}
          />
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
                    className={`w-full text-left px-4 py-3 border rounded-sm transition
                      ${curAns === k
                        ? "border-primary bg-primary/10"
                        : "border-gray-200 hover:bg-primary/5"
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
                  className={`px-5 py-2 rounded-full ${idx === 0
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-bg hover:bg-gray-100"
                    }`}
                >
                  Back
                </button>
                <div className="flex gap-5">
                  <button
                    onClick={handleSkip}
                    className="px-5 py-2 rounded-full bg-warning/20 text-warning hover:bg-warning/30"
                  >
                    Skip
                  </button>
                  {idx + 1 < total ? (
                    <button
                      onClick={handleNext}
                      disabled={curAns == null}
                      className={`px-5 py-2 rounded-full ${curAns == null
                        ? "bg-primary/40 text-white cursor-not-allowed"
                        : "bg-primary text-white hover:bg-blue-600"
                        }`}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={finish}
                      disabled={curAns == null}
                      className={`px-5 py-2 rounded-full ${curAns == null
                        ? "bg-success/40 text-white cursor-not-allowed"
                        : "bg-success text-white hover:bg-green-600"
                        }`}
                    >
                      Finish
                    </button>
                  )}
                </div>
              </footer>
            </motion.div>
          ) : (
            <>
              {UserScorePercentage >= 85 ? (
                <motion.div
                  key="result-pass"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-full max-w-lg bg-white rounded-sm shadow-xl p-10 text-center space-y-6"
                >
                  <h2 className="text-3xl font-extrabold text-primary">Quiz Completed!</h2>
                  <p className="text-lg text-textPrimary">
                    You scored <span className="font-bold">{score}</span> / {total}
                  </p>
                  <button
                    onClick={() => navigate(`/certificate/${btoa(EncID)}/${btoa(EncPhone)}`)}
                    className="bg-primary text-white px-6 py-2 rounded hover:bg-blue-600"
                  >
                    View Certificate
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="result-fail"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-full max-w-lg bg-white rounded-sm shadow-xl p-10 text-center space-y-6"
                >
                  <h2 className="text-3xl font-extrabold text-primary">Thanks for Participating!</h2>
                  <p className="text-lg text-textPrimary">
                    You scored <span className="font-bold">{score}</span> / {total}
                  </p>
                  <button
                    onClick={() => navigate("/")}
                    className="bg-primary text-white px-6 py-2 rounded hover:bg-blue-600"
                  >
                    Home
                  </button>
                </motion.div>
              )}


            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
