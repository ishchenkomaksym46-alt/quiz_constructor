import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export default function Main() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const isAuth = async () => {
            setError(null);
            axios.defaults.withCredentials = true;

            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/checkAuth`);

                if(res.data.success === false) {
                    navigate('/login');
                } else {
                    setIsAuthenticated(true);
                    const userEmail = await axios.get(`${process.env.REACT_APP_API_URL}/user`);

                    if(userEmail.data.success) {
                        setUserEmail(userEmail.data.email);
                    } else {
                        console.error(userEmail.data.message);
                        setError(userEmail.data.message);
                    }
                }
            } catch (e: any) {
                console.error(e);
            }
        }

        isAuth();
    }, [navigate]);

    return (
        <div>
            <header>
                <div>
                    {isAuthenticated ? (
                        <div>
                            <p>Logged in as: {userEmail}</p>
                            <a href='/login'>Logout</a>
                            <a href='/createQuiz'>Create Quiz</a>
                            <a href="/accountInfo">Account Info</a>
                        </div>
                    ) : (
                        <div>
                            <a href="/login">Log In</a>
                            <a href="/signin">Register</a>
                        </div>
                    )}
                    <a href="/quizzes">Quizzes</a>
                </div>
            </header>

            <section className="hero-fullscreen">
                <h1>Welcome to QuizMaster</h1>
                <p className="hero-intro">
                    The ultimate platform for creating, sharing, and taking interactive quizzes.
                    Whether you're a student preparing for exams, a teacher creating educational content,
                    or simply someone who loves to learn, QuizMaster provides you with all the tools you need
                    to make learning fun, engaging, and effective.
                </p>

                <div className="features-grid">
                    <div className="feature-box">
                        <h3>📝 Create Custom Quizzes</h3>
                        <p>
                            Build unlimited quizzes with our intuitive quiz creator. Add true/false questions on any topic,
                            organize them in any order, and customize your quiz to match your learning goals. No technical
                            skills required – just your knowledge and creativity.
                        </p>
                    </div>

                    <div className="feature-box">
                        <h3>🔍 Browse & Discover</h3>
                        <p>
                            Explore thousands of quizzes created by our community. Use powerful filters to find quizzes
                            by newest, oldest, or most liked. Search by title to quickly find exactly what you're looking
                            for. Discover new topics and expand your knowledge every day.
                        </p>
                    </div>

                    <div className="feature-box">
                        <h3>📊 Track Your Progress</h3>
                        <p>
                            See your score instantly after completing each quiz. Track how many questions you answered
                            correctly and identify areas for improvement. Review your quiz history and watch your
                            knowledge grow over time.
                        </p>
                    </div>

                    <div className="feature-box">
                        <h3>❤️ Like & Share</h3>
                        <p>
                            Show appreciation for great quizzes by liking them. Help others discover quality content
                            and see which quizzes are most popular in the community. Your likes help creators know
                            what content resonates with learners.
                        </p>
                    </div>

                    <div className="feature-box">
                        <h3>👤 Personal Account</h3>
                        <p>
                            Manage all your quizzes in one place. View your created quizzes, delete ones you no longer
                            need, and keep track of your contributions to the community. Your personal dashboard makes
                            it easy to stay organized.
                        </p>
                    </div>

                    <div className="feature-box">
                        <h3>🎯 Instant Feedback</h3>
                        <p>
                            Get immediate feedback on your answers. Know right away if you're correct or need to review
                            the material. Learn from your mistakes and reinforce your knowledge with every question you
                            answer.
                        </p>
                    </div>
                </div>

                <p className="hero-cta-text">
                    Join thousands of users who are already using QuizMaster to test their knowledge,
                    challenge their friends, and explore new topics every day. Create unlimited quizzes,
                    track your progress, and become part of a growing community of learners. Start your
                    learning journey today – it's completely free!
                </p>

                <div className="hero-actions">
                    {isAuthenticated ? (
                        <>
                            <a href="/createQuiz" className="btn-hero">Create Your First Quiz</a>
                            <a href="/quizzes" className="btn-hero-outline">Browse All Quizzes</a>
                        </>
                    ) : (
                        <>
                            <a href="/signin" className="btn-hero">Get Started Free</a>
                            <a href="/quizzes" className="btn-hero-outline">Explore Quizzes</a>
                        </>
                    )}
                </div>
                {error && <p className="error-msg">{error}</p>}
            </section>
        </div>
    )
}