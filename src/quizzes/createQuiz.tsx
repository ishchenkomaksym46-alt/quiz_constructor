import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export default function CreateQuiz() {
    const [questionsNumber, setQuestionsNumber] = useState<number[]>([1]);
    const [quizName, setQuizName] = useState<string>('');
    const [questions, setQuestions] = useState<{text: string, answer: boolean | null}[]>([{text: '', answer: null}]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

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

    async function createQuiz(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        // Валидация на клиенте
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
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/quizzes/create`, {
                quizName,
                questions
            });

            if(res.data.success) {
                navigate("/quizzes");
            } else {
                setError(res.data.message);
            }
        } catch (error: any) {
            console.log(error);
            setError(error.message);
        }
    }

    return(
        <div>
            <h2>Create your quiz</h2>
            <form onSubmit={createQuiz}>
                <input type='text' name='name' placeholder='Quiz name' onChange={(e) => setQuizName(e.target.value)}/>
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
                <button type='submit'>Create quiz</button>
                <p>{error}</p>
            </form>
        </div>
    )
}