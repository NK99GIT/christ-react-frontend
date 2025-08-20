import React,{useEffect,useState} from 'react';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GiCrossFlare } from "react-icons/gi";
import { BsBook, BsBookHalf, BsMusicNoteBeamed } from "react-icons/bs";
import { FaPrayingHands } from "react-icons/fa";
import QuizServices from "../services/Quiz.services";

function QuizPlayLists() {

      const [categories, setCategories] = useState([]);
      const [loading, setLoad] = useState(true);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 }
  }; 

//   const categories = [
//     { id: 1, name: "Bible Stories", icon: GiCrossFlare, ring: "ring-primary" },
//     { id: 2, name: "New Testament", icon: BsBook, ring: "ring-success" },
//     { id: 3, name: "Old Testament", icon: BsBookHalf, ring: "ring-warning" },
//     { id: 4, name: "Hymns & Worship", icon: BsMusicNoteBeamed, ring: "ring-error" },
//     { id: 5, name: "Saints & History", icon: FaPrayingHands, ring: "ring-secondary" },
//   ];

   const fetchData = async () => {
    setLoad(true);
    try {
      const res = await QuizServices.getQuizAllPlay();
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to load quizzes", err);
    } finally {
      setLoad(false);
    }
  };

    useEffect(() => {
      fetchData();
    }, []);

  return (
    <div>
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.h3
          className="text-3xl font-extrabold text-center mb-14 text-textPrimary"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
         Quiz Categories
        </motion.h3>

        <div className="grid gap-10 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map(({ id, quiz_play_name, ring }, index) => (
            <motion.div
              key={id}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{
                y: -10,
                scale: 1.06,
                boxShadow: "0 20px 35px rgba(0,0,0,0.15)",
              }}
              className="relative w-full max-w-sm bg-white rounded-sm shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)]
              flex flex-col items-center text-center p-7"
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ring-primary ring-2 bg-[#e2feee] animate-pulse`}
              >
                <BsBook className="text-4xl text-green-600" />
              </div>

              <p className="font-bold text-textPrimary text-lg">{quiz_play_name}</p>
              <p className="text-xs text-textSecondary mt-1">10+ quizzes</p>

              <Link
                to={`/quizplay/${btoa(id)}`}
                className="mt-7 inline-flex justify-center w-full bg-primary text-white py-2 rounded-sm font-medium shadow hover:bg-blue-600 transition-colors"
              >
                Play
              </Link>
            </motion.div>
          ))}
        </div>
        {categories.length===0 &&
        <>
               <motion.h3
          className="text-3xl font-extrabold text-center mb-14 text-textPrimary"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          No Data
        </motion.h3>
        </> }
      </section>
    </div>
  );
}

export default QuizPlayLists;
