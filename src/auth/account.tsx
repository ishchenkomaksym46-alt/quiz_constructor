import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export default function Account() {
    const [accountInfo, setAccountInfo] = useState([]);
    const [userQuizzes, setUserQuizzes] = useState([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            setError(null);

            try {
                axios.defaults.withCredentials = true;

                const res = await axios.get(`${process.env.REACT_APP_API_URL}/checkAuth`);

                if(res.data.success === false) {
                    navigate('/login');
                    console.error(res.data.message);
                } else {
                    setAccountInfo(res.data.accountInfo);
                }
            } catch (error: any) {
                navigate('/login');
                console.error(error.message);
                setError(error.message);
            }
        }

        const getQuizzes = async () => {
            setError(null)

            try {
                axios.defaults.withCredentials = true;
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/getQuizzes`);

                if(res.data.success) {
                    setUserQuizzes(res.data.quizzes);
                } else {
                    console.error(res.data.message);
                    setError(res.data.message);
                }
            } catch (error: any) {
                console.error(error.message);
                setError(error.message);
            }
        }

        checkAuth();
        getQuizzes();
    }, [navigate]);

    async function deleteQuiz(id: string) {
        setError(null);
        axios.defaults.withCredentials = true;

        try {
            const res = await axios.delete(`${process.env.REACT_APP_API_URL}/deleteQuiz?id=${id}`);

            if(res.data.success) {
                setUserQuizzes(userQuizzes.filter((quiz: any) => quiz.id !== id));
            } else {
                console.error(res.data.message);
                setError(res.data.message);
            }
        } catch (error: any) {
            console.error(error.message);
            setError(error.message);
        }
    }

    return(
        <div>
            <h1>Account Info</h1>
            {accountInfo.map((el: any) => (
                <div key={el.id}>
                    <h1>Username: {el.username}</h1>
                    <h2>Email: {el.email}</h2>
                    <h4>User id: {el.id}</h4>
                </div>
            ))}
            <h1>Your quizzes</h1>
            {userQuizzes.length === 0 && <p>You haven't created any quizzes yet. <a href='/createQuiz'>Create quiz!</a></p>}
            {userQuizzes.map((el: any) => (
                <div key={el.id}>
                    <h2>Title: {el.title}</h2>
                    <h3>Created at: {new Date(el.created_at).toLocaleDateString('us-US')}</h3>
                    <a href={`/start?id=${el.id}`}>Start</a>
                    <button onClick={() => navigate(`/editQuiz?id=${el.id}`)}>Edit</button>
                    <button onClick={() => deleteQuiz(el.id)}>Delete</button>
                </div>
            ))}
            <p>{error}</p>
        </div>
    )
}