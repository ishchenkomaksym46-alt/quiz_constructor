import {useEffect, useState} from "react";
import axios from "axios";
import {useSearchParams} from "react-router-dom";

export default function Start() {
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState<string | null>(null);
    const [question, setQuestion] = useState<number>(1);
    const [searchParams] = useSearchParams();
    const [isClickedTrue, setIsClickedTrue] = useState<boolean>(false);
    const [isClickedFalse, setIsClickedFalse] = useState<boolean>(false);
    const [isDone, setIsDone] = useState<boolean>(false);
    const [isFinished, setIsFinished] = useState<boolean>(false);
    const [correctCount, setCorrectCount] = useState<number>(0);
    const [totalQuestions, setTotalQuestions] = useState<number>(0);
    const id: number = Number(searchParams.get('id'));

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
            } catch (error: any) {
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

    async function done(answer: boolean) {
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

    return(
        <div>
            {isFinished ? (
                <>
                    <h1>Quiz is finished!</h1>
                    <h2>Your Score: {correctCount}/{totalQuestions}</h2>
                    <a href='/'>Back</a>
                </>
            ) : (
                questions.map((el: any)=> (
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