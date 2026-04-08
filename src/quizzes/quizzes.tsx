import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export default function Quizzes() {
    const [quizzes, setQuizzes] = useState([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getQuizzes = async () => {
            setError(null);

            try {
                axios.defaults.withCredentials = true;

                const res = await axios.get(`${process.env.REACT_APP_API_URL}/quizzes`);

                if(res.data.success) {
                    setQuizzes(res.data.quizzes);

                } else {
                    navigate('/login');
                }
            } catch (error: any) {
                console.error(error);
                setError(error.message);
                navigate('/login');
            }
        }

        getQuizzes()
    }, [])

    return(
        <div className="quizzes">
            {quizzes.map((el: any) => (
                <div key={el.id}>
                    <h2>Title: {el.title}</h2>
                    <h3>Created at: {new Date(el.created_at).toLocaleDateString('us-US')}</h3>
                    <h4>Creator id: {el.creator_id}</h4>
                    <button className="start" onClick={() => navigate(`/start?id=${el.id}`)}>Start Quiz</button>
                </div>
            ))}
            <p>{error}</p>
        </div>
    )
}