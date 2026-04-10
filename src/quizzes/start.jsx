import {useEffect, useState} from "react";
import axios from "axios";
import {useSearchParams} from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";

export default function Start() {
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState(null);
    const [question, setQuestion] = useState(1);
    const [searchParams] = useSearchParams();
    const [isClickedTrue, setIsClickedTrue] = useState(false);
    const [isClickedFalse, setIsClickedFalse] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const id = Number(searchParams.get('id'));

    useEffect(() => {
        const getQuiz = async () => {
            setError(null);

            try {
                axios.defaults.withCredentials = true;

                const res = await axios.get(
                    `${process.env.REACT_APP_API_URL}/quizzes/start?id=${id}&question=${question}`);

                if(res.data.success) {
                    setQuestions(res.data.questions);
                    if(res.data.questions.length === 0 && question > 1) {
                        setIsFinished(true);
                    } else {
                        setIsFinished(false);
                        setTotalQuestions(question);
                    }
                } else {
                    setError(res.data.message);
                }
            } catch (error) {
                console.error(error);
                if(error.response && error.response.status === 404) {
                    setIsFinished(true);
                } else {
                    setError(error.message);
                }
            }
        }

        getQuiz();
    }, [question, id]);

    useEffect(() => {
        const checkLike = async () => {
            try {
                axios.defaults.withCredentials = true;
                const res = await axios.get(
                    `${process.env.REACT_APP_API_URL}/quizzes/checkLike?quiz_id=${id}`
                );

                if(res.data.success) {
                    setIsLiked(res.data.isLiked);
                    setLikesCount(res.data.count);
                }
            } catch (error) {
                console.error(error);
            }
        }

        if(isFinished) {
            checkLike();
        }
    }, [isFinished, id]);

    async function done(answer) {
        setError(null)
        if(!isClickedTrue && !isClickedFalse) {
            return setError('Choose an answer!');
        }

        if(answer === isClickedTrue) {
            setError('Correct!');
            setCorrectCount(correctCount + 1);
        } else {
            setError('Wrong Answer!');
        }

        setIsDone(true);
    }

    async function likeQuiz() {
        setError(null);

        try {
            axios.defaults.withCredentials = true;
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/quizzes/like?quiz_id=${id}`);

            if(res.data.success) {
                if(res.data.action === 'liked') {
                    setIsLiked(true);
                    setLikesCount(likesCount + 1);
                } else {
                    setIsLiked(false);
                    setLikesCount(likesCount - 1);
                }
            } else {
                setError(res.data.message);
            }
        } catch (error) {
            console.log(error);
            setError('Unknown error');
        }
    }

    return(
        <div>
            {isFinished ? (
                <>
                    <h1>Quiz is finished!</h1>
                    <h2>Your Score: {correctCount}/{totalQuestions}</h2>
                    <a href='/'>Back</a>
                    <div>
                        {!isLiked ? (
                            <div onClick={() => likeQuiz()} style={{cursor: 'pointer'}}>
                                <FaRegHeart /> Like quiz ({likesCount})
                            </div>
                        ) : (
                            <div onClick={() => likeQuiz()} style={{cursor: 'pointer'}}>
                                <FaHeart /> Unlike quiz ({likesCount})
                            </div>
                        )}
                    </div>
                </>
            ) : (
                questions.map((el)=> (
                        <div key={el.id}>
                            <h1>{el.question}</h1>
                            <button onClick={() => setIsClickedTrue(!isClickedTrue)}>True</button>
                            <button onClick={() => setIsClickedFalse(!isClickedFalse)}>False</button>
                            <button onClick={() => done(el.correct_variant)}>Submit</button>
                            {isDone && <div>
                                <button onClick={() => {setQuestion(question + 1); setIsClickedTrue(false); setIsClickedFalse(false); setIsDone(false);}}>Next</button>
                            </div>}
                        </div>
                ))
            )}
            <p>{error}</p>
        </div>
    )
}