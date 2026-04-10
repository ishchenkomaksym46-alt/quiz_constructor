import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export default function Quizzes() {
    const [quizzes, setQuizzes] = useState([]);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>('newest');
    const [search, setSearch] = useState<string>('');
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const getQuizzes = async () => {
            setError(null);

            try {
                axios.defaults.withCredentials = true;

                const res = await axios.get(`${process.env.REACT_APP_API_URL}/quizzes?filter=${filter}&page=${page}`);

                if(res.data.success) {
                    setQuizzes(res.data.quizzes);
                } else {
                    navigate('/login');
                }
            } catch (error: any) {
                console.error(error);
                setError(error.message);
            }
        }

        const searchQuiz = async () => {
            setError(null);

            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/searchQuiz?search=${search}&page=${page}`);

                if(res.data.success) {
                    setQuizzes(res.data.quizzes);
                } else {
                    setError(res.data.message);
                }

            } catch (error: any) {
                console.error(error);
                setQuizzes([]);
            }
        }

        if(search) {
            searchQuiz();
        } else {
            getQuizzes();
        }
    }, [filter, search, page])

    return(
        <div className="quizzes">
            <h1>Quizzes</h1>

            <aside>
                <div className="filters">
                    <h2>Filters</h2>
                    <input type="radio" name='filter' onChange={() => setFilter('newest')} checked={filter === 'newest'}/> The newest first
                    <input type="radio" name='filter' onChange={() => setFilter('oldest')} checked={filter === 'oldest'}/> The oldest first
                    <input type='radio' name='filter' onChange={() => setFilter('most_liked')} checked={filter === 'most_liked'}/> The most liked first
                </div>

                <hr />

                <div className="search">
                    <h2>Search</h2>
                    <input type="text" placeholder="Search by title..." onChange={(e) => setSearch(e.target.value)} />
                </div>

                <hr />
            </aside>

            {quizzes.length === 0 && <p>No quizzes yet</p>}
            {quizzes.map((el: any) => (
                <div key={el.id}>
                    <h2>Title: {el.title}</h2>
                    <h3>{el.like_count} likes</h3>
                    <h3>Created at: {new Date(el.created_at).toLocaleDateString('us-US')}</h3>
                    <h4>Creator id: {el.creator_id}</h4>
                    <button className="start" onClick={() => navigate(`/start?id=${el.id}`)}>Start Quiz</button>
                </div>
            ))}
            <button onClick={() => setPage(page - 1)}>Back</button>
            <button onClick={() => setPage(page + 1)}>Next</button>
            <p>{error}</p>
        </div>
    )
}