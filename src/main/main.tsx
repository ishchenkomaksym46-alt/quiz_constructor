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
                {isAuthenticated ? <div>
                    <p>Logged in as: {userEmail}</p>
                    <a href='/login'>Logout</a>
                    <a href='/createQuiz'>Create Quiz</a>
                    <a href="/accountInfo">Account Info</a>
                </div> : <div>
                    <a href="/login">Log In</a>
                    <a href="/signin">Register</a>
                </div>}
                <a href="/quizzes">Quizzes</a>
            </header>

            <div className="content">
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur cum debitis dicta dolorem dolorum ea, esse facilis incidunt minus modi natus nisi officiis quod rem repellendus similique sint. Eveniet, placeat!</p>
                <p>{error}</p>
            </div>
        </div>
    )
}