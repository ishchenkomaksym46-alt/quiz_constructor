import {useState, useEffect} from "react";
import axios from "axios";
import {useNavigate, useSearchParams} from "react-router-dom";

export default function EditQuiz() {
    const [questionsNumber, setQuestionsNumber] = useState<number[]>([1]);
    const [quizName, setQuizName] = useState<string>('');
    const [questions, setQuestions] = useState<{text: string, answer: boolean | null}[]>([{text: '', answer: null}]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const quizId = searchParams.get('id');

    useEffect(() => {
        const fetchQuiz = async () => {
            if (!quizId) {
                setError('Quiz ID is required');
                setLoading(false);
                return;
            }

            try {
                axios.defaults.withCredentials = true;
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/quizzes/get?id=${quizId}`);

                if (res.data.success) {
                    setQuizName(res.data.quiz.title);
                    const loadedQuestions = res.data.questions.map((q: any) => ({
                        text: q.question,
                        answer: q.correct_variant
                    }));
                    setQuestions(loadedQuestions);
                    setQuestionsNumber(loadedQuestions.map((_: any, i: number) => i + 1));
                } else {
                    setError(res.data.message);
                }
            } catch (error: any) {
                console.error(error);
                setError(error.response?.data?.message || 'Failed to load quiz');
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [quizId]);

    function addInput() {
        setQuestionsNumber([...questionsNumber, questionsNumber.length + 1]);
        setQuestions([...questions, {text: '', answer: null}]);
    }

    function removeInput() {
        if (questionsNumber.length > 1) {
            setQuestionsNumber(questionsNumber.filter((x) => x !== questionsNumber.length).sort((a, b) => a - b));
            setQuestions(questions.slice(0, -1));
        }
    }

    async function editQuiz(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!quizName.trim()) {
            setError('Quiz name is required');
            return;
        }

        for (let i = 0; i < questions.length; i++) {
            if (!questions[i].text.trim()) {
                setError(`Question ${i + 1} text is required`);
                return;
            }
            if (questions[i].answer === null) {
                setError(`Question ${i + 1} answer is required`);
                return;
            }
        }

        axios.defaults.withCredentials = true;

        try {
            const res = await axios.put(`${process.env.REACT_APP_API_URL}/quizzes/edit?id=${quizId}`, {
                quizName,
                questions
            });

            if(res.data.success) {
                navigate("/quizzes");
            } else {
                setError(res.data.message);
            }
        } catch (error: any) {
            console.error(error);
            setError(error.response?.data?.message || 'Failed to update quiz');
        }
    }

    if (loading) {
        return <div>Loading quiz...</div>;
    }

    return(
        <div>
            <h2>Edit Quiz</h2>
            <form onSubmit={editQuiz}>
                <input
                    type='text'
                    name='name'
                    placeholder='Quiz name'
                    value={quizName}
                    onChange={(e) => setQuizName(e.target.value)}
                />
                {questionsNumber.map((_, index) => {
                    return (
                        <div key={index}>
                            <input
                                type='text'
                                name={`question-${index}`}
                                placeholder='Question'
                                value={questions[index]?.text || ''}
                                onChange={(e) => {
                                    const newQuestions = [...questions];
                                    newQuestions[index].text = e.target.value;
                                    setQuestions(newQuestions);
                                }}
                            />
                            <input
                                type='radio'
                                name={`answer-${index}`}
                                value='True'
                                checked={questions[index]?.answer === true}
                                onChange={() => {
                                    const newQuestions = [...questions];
                                    newQuestions[index].answer = true;
                                    setQuestions(newQuestions);
                                }}
                            /> True
                            <input
                                type='radio'
                                name={`answer-${index}`}
                                value='False'
                                checked={questions[index]?.answer === false}
                                onChange={() => {
                                    const newQuestions = [...questions];
                                    newQuestions[index].answer = false;
                                    setQuestions(newQuestions);
                                }}
                            /> False
                            <button type='button' onClick={addInput}>+</button>
                            <button type='button' onClick={removeInput}>-</button>
                        </div>
                    )
                })}
                <button type='submit'>Update quiz</button>
                <p>{error}</p>
            </form>
            <div style={{ marginTop: '20px' }}>
                <a href="/quizzes">Cancel</a>
            </div>
        </div>
    )
}
