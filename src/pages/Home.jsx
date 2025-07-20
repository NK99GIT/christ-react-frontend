import { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GiCrossFlare } from "react-icons/gi";
import { BsBook, BsBookHalf, BsMusicNoteBeamed } from "react-icons/bs";
import { FaPrayingHands } from "react-icons/fa";
import Logo from "../assets/Images/1.png";   // ⬆️
import BannerImg from "../assets/Images/image.png";   // ⬆️
import { GiOpenBook, GiFeather, GiAnchor } from "react-icons/gi";
import { FaQuillAlt, FaBible } from "react-icons/fa";
import QuizServices from "../services/Quiz.services";

// services  



const categories = [
    { id: 1, name: "Bible Stories", icon: GiCrossFlare, ring: "ring-primary" },
    { id: 2, name: "New Testament", icon: BsBook, ring: "ring-success" },
    { id: 3, name: "Old Testament", icon: BsBookHalf, ring: "ring-warning" },
    { id: 4, name: "Hymns & Worship", icon: BsMusicNoteBeamed, ring: "ring-error" },
    { id: 5, name: "Saints & History", icon: FaPrayingHands, ring: "ring-secondary" },
];


const testimonials = [
    {
        id: 1,
        name: "David (12 yrs)",
        text: "These Bible quizzes make Sunday School exciting!",
        img: "https://randomuser.me/api/portraits/men/71.jpg",
    },
    {
        id: 2,
        name: "Mrs Grace (Parent)",
        text: "A wonderful way for my kids to deepen their faith.",
        img: "https://randomuser.me/api/portraits/women/55.jpg",
    },
    {
        id: 3,
        name: "Leah (10 yrs)",
        text: "I love singing the hymn questions and earning badges!",
        img: "https://randomuser.me/api/portraits/women/44.jpg",
    },
];

const partners = [
    { name: "Google", logo: "https://logo.clearbit.com/google.com" },
    { name: "Microsoft", logo: "https://logo.clearbit.com/microsoft.com" },
    { name: "TechUS", logo: "https://tech.us/hubfs/raw_assets/public/project/images/techus-logos/tech.us-black-logo.png" },
    { name: "Sci Museum", logo: "https://logo.clearbit.com/sciencemuseum.org.uk" },
    { name: "Codecademy", logo: "https://logo.clearbit.com/codecademy.com" },
    { name: "Coursera", logo: "https://logo.clearbit.com/coursera.org" },
    { name: "Khan Academy", logo: "https://logo.clearbit.com/khanacademy.org" },
    { name: "Quizlet", logo: "https://logo.clearbit.com/quizlet.com" },
    { name: "Udemy", logo: "https://logo.clearbit.com/udemy.com" },
];
const Home = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [dailyKPI, setDailyKPI] = useState(null);
    const [Realcategories , setReaclcategories] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const leaderboardData = await QuizServices.getLeaderboard();
               
                setLeaderboard(leaderboardData.data.slice(0, 10));
            } catch (err) {
                console.error("Some API failed:", err);
            }
        };
          const fetchData = async () => { 
        try {
            const res = await QuizServices.getQuizAllPlay();
             
            setReaclcategories(res.data);
        } catch (err) {
            console.error("Failed to load quizzes", err);
        } finally { 
        }
    };

        loadData();
        fetchData();
    }, []);

    /* ────────── Motion helpers ────────── */
    const fadeUp = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0 } };



    return (
        <>
            {/* ───────── HEADER ───────── */}
            <header className="bg-white/90 backdrop-blur-md shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                    <div className='flex items-center gap-4'>
                        <img src={Logo} className='w-14 rounded-full bg-gray-600' />
                        <h2 className='text-4xl text-red-700'>
                            <span className='font-bold'>Friends </span>
                            <span className='font-bold'>  In Christ</span>
                        </h2>
                    </div>
                    <nav className="hidden md:flex gap-8 font-semibold">
                        <Link to="/admin/login" className="hover:text-primary">Admin</Link>
                        {/* <Link to="/leaderboard" className="hover:text-primary">Leaderboard</Link> */}
                    </nav>
                    <Link
                        to="/login"
                        className="md:hidden bg-primary text-white px-4 py-1 rounded-sm text-sm"
                    >
                        Play
                    </Link>
                </div>
            </header>

            {/* ───────── HERO ───────── */}
            <section className="bg-gradient-to-br from-primary to-purpleAccent text-white">
                <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center gap-12">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        animate="show"
                        transition={{ duration: 0.6 }}
                        className="space-y-6 md:w-1/2"
                    >
                        <h1 className="text-5xl font-extrabold leading-tight">
My Bibile Quiz
                        </h1>
                        <h2 className="text-3xl font-extrabold leading-tight">
Dive Deeper into the Word of God
                        </h2>
                        <p className="text-lg">
                           From Genesis to Revelation, explore themed quizzes, unlock levels, and climb the leaderboard as you master scripture stories, characters, and verses — all while deepening your spiritual walk.
                        </p>
                        <div className="flex gap-4">
                            {/* <Link
                                to="/leaderboardn"
                                className="bg-white text-primary font-bold px-6 py-3 rounded-sm shadow hover:shadow-lg transition"
                            >   View Leaderboard
                            </Link> */}
                            {/* <Link
                                to="/leaderboard"
                                className="underline underline-offset-4 font-semibold"
                            >
                                View Leaderboard
                            </Link> */}
                        </div>
                    </motion.div>

                    <motion.img
                        src={BannerImg}
                        alt="Kids playing quiz"
                        className="w-full max-w-sm md:max-w-md"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    />
                </div>
            </section>

            {/* ─── QUIZ CATEGORIES: */}

            {/* ─── QUIZ CATEGORIES (wider card + hover anim) ─── */}
            <section className="max-w-7xl mx-auto px-6 py-20 hidden" >
                <motion.h3
                    className="text-3xl font-extrabold text-center mb-14 text-textPrimary"
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    Practice instead of “Quiz Categories.
                </motion.h3>

                <div className="grid gap-10 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
                    {categories.map(({ id, name, icon: Icon, ring }) => (
                        <motion.div
                            key={id}
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            transition={{ delay: id * 0.05 }}
                            whileHover={{
                                y: -10,
                                scale: 1.06,
                                boxShadow: "0 20px 35px rgba(0,0,0,0.15)",
                            }}
                            className="relative w-full max-w-sm bg-white rounded-sm shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)]
                   flex flex-col items-center text-center p-7"
                        >
                            {/* animated icon badge */}
                            <div
                                className={`w-16 h-16 rounded-full flex items-center justify-center mb-6
                      ring-primary ring-2 bg-[#e2feee] animate-pulse`}
                            >
                                <Icon className="text-4xl text-green-600" />
                            </div>

                            <p className="font-bold text-textPrimary text-lg">{name}</p>
                            <p className="text-xs text-textSecondary mt-1">10+ quizzes</p>

                            <Link
                                to={`/practice/${id}`}
                                className="mt-7 inline-flex justify-center w-full
                     bg-primary text-white py-2 rounded-sm font-medium
                     shadow hover:bg-blue-600 transition-colors"
                            >
                                Play
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>
            {/* ─── QUIZ CATEGORIES (wider card + hover anim) ─── */}
            <section className="max-w-7xl mx-auto px-6 py-20 hidden" >
                <motion.h3
                    className="text-3xl font-extrabold text-center mb-14 text-textPrimary"
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    Practice instead of “Quiz Categories.
                </motion.h3>

                <div className="grid gap-10 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
                    {Realcategories.map(({ id, name }) => (
                        <motion.div
                            key={id}
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            transition={{ delay: id * 0.05 }}
                            whileHover={{
                                y: -10,
                                scale: 1.06,
                                boxShadow: "0 20px 35px rgba(0,0,0,0.15)",
                            }}
                            className="relative w-full max-w-sm bg-white rounded-sm shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)]
                   flex flex-col items-center text-center p-7"
                        >
                            {/* animated icon badge */}
                            <div
                                className={`w-16 h-16 rounded-full flex items-center justify-center mb-6
                      ring-primary ring-2 bg-[#e2feee] animate-pulse`}
                            >
                                <BsBook      className="text-4xl text-green-600" />
                            </div>

                            <p className="font-bold text-textPrimary text-lg">{name}</p>
                            <p className="text-xs text-textSecondary mt-1">10+ quizzes</p>

                            <Link
                                 to={`/quizplay/${btoa(id)}`}
                                className="mt-7 inline-flex justify-center w-full
                     bg-primary text-white py-2 rounded-sm font-medium
                     shadow hover:bg-blue-600 transition-colors"
                            >
                                Play
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ─── QUIZ CATEGORIES (wider card + hover anim) ─── */}
            <section className="bg-primary/10">
                <div className=" max-w-7xl  mx-auto px-6 py-20">
                    <motion.h3
                        className="text-3xl font-extrabold text-center mb-14 text-textPrimary"
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                    >
                        Quiz By Chapters
                    </motion.h3>

                    <div className="grid gap-10 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
                        {Realcategories .map(({ id, quiz_play_name }) => (
                            <motion.div
                                key={id}
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true }}
                                transition={{ delay: id * 0.05 }}
                                whileHover={{
                                    y: -10,
                                    scale: 1.06,
                                    boxShadow: "0 20px 35px rgba(0,0,0,0.15)",
                                }}
                                className="relative w-full max-w-sm bg-white rounded-sm shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)]
                   flex flex-col items-center text-center p-7"
                            >
                                {/* animated icon badge */}
                                <div
                                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-6
                    ring-primary  ring-2 bg-[#e2feee] animate-pulse`}
                                >
                                    <BsBook className="text-4xl text-blue-600" />
                                </div>

                                <p className="font-bold text-textPrimary text-lg">{quiz_play_name}</p>
                                <p className="text-xs text-textSecondary mt-1">100+ quizzes</p>

                                <Link
                                    to={`/quizplay/${btoa(id)}`}
                                    className="mt-7 inline-flex justify-center w-full
                     bg-success text-white py-2 rounded-sm font-medium
                     shadow hover:bg-green-600 transition-colors"
                                >
                                    Play
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───────── LEADERBOARD ───────── */}
            <section className=" py-24">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.h2 className="text-3xl font-extrabold text-center mb-12 text-textPrimary"
                        variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
                        Weekly Leaderboard
                    </motion.h2>

                    <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                        className="overflow-x-auto rounded-sm shadow-xl bg-white">
                        <table className="w-full text-left">
                            <thead className="bg-primary text-white">
                                <tr>
                                    <th className="px-5 py-3">Rank</th>
                                    <th className="px-5 py-3">Player</th>
                                    <th className="px-5 py-3">Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboard.map(({ id, name, score }, index) => (
                                    <tr key={index} className="odd:bg-primary/5 last:border-none border-b">
                                        <td className="px-5 py-3 font-semibold">
                                            {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index+1}
                                        </td>
                                        <td className="px-5 py-3">  {name.charAt(0).toUpperCase() + name.slice(1)}</td>
                                        <td className="px-5 py-3">{score}</td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </motion.div>

                    <div className="text-center mt-8">
                        {/* <Link to="/leaderboard" className="text-primary font-semibold underline">
                            View full leaderboard →
                        </Link> */}
                    </div>
                </div>
            </section>


            {/* ───────── TESTIMONIALS ───────── */}
            <section className="bg-primary/10 py-24">
                <div className="max-w-5xl mx-auto px-6">
                    <motion.h2 className="text-3xl font-extrabold text-center mb-14 text-textPrimary"
                        variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
                        Voices from the Congregation
                    </motion.h2>
                    <div className="grid md:grid-cols-3 gap-10">
                        {testimonials.map(({ id, name, text, img }, idx) => (
                            <motion.div key={id} variants={fadeUp} initial="hidden" whileInView="show"
                                viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                                className="bg-white rounded-sm p-8 shadow-lg flex flex-col items-center text-center">
                                <img src={img} alt={name} className="w-20 h-20 rounded-full object-cover mb-4" />
                                <p className="italic text-textSecondary mb-4">“{text}”</p>
                                <p className="font-semibold text-textPrimary">{name}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───────── PARTNERS ───────── */}

            {/* <section className="max-w-6xl mx-auto px-6 py-24">
                <motion.h3
                    className="text-3xl font-extrabold text-center mb-14 text-textPrimary"
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    Our Awesome Partners
                </motion.h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
                    {partners.map(({ name, logo }, i) => (
                        <motion.div
                            key={name}
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ y: -6, boxShadow: "0 12px 22px rgba(0,0,0,0.15)" }}
                            className="bg-white rounded-sm p-4 flex flex-col items-center
                   shadow hover:shadow-lg transition"
                        >
                            <img
                                src={logo}
                                alt={name}
                                className="w-20 h-20 object-contain mb-3 transition duration-300"
                            />
                            <p className="text-center text-sm font-semibold text-textPrimary">
                                {name}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section> */}




            {/* ───────── FOOTER ───────── */}
            <footer className="bg-textPrimary text-white py-8">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-8">
                    <div>
                        <h4 className="font-extrabold text-lg mb-2">
                            Friends In Christ © {new Date().getFullYear()}
                        </h4>
                        <p className="text-sm opacity-80">
                            Made with ❤️ for curious kids & everyone.
                        </p>
                    </div>

                    <nav className="flex flex-col md:flex-row gap-4 text-sm font-semibold">
                        <Link to="/" className="hover:underline">
                            Home
                        </Link>
                        <Link to="/privacy" className="hover:underline">
                            Privacy
                        </Link>
                        <Link to="/terms" className="hover:underline">
                            Terms
                        </Link>
                        <Link to="/contact" className="hover:underline">
                            Contact
                        </Link>
                    </nav>

                    <div className="flex gap-4">
                        <a href="#" className="hover:opacity-80">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/5968/5968764.png"
                                alt="Facebook"
                                className="w-6"
                            />
                        </a>
                        <a href="#" className="hover:opacity-80">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/733/733635.png"
                                alt="Twitter"
                                className="w-6"
                            />
                        </a>
                        <a href="#" className="hover:opacity-80">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/1384/1384063.png"
                                alt="Instagram"
                                className="w-6"
                            />
                        </a>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Home;
