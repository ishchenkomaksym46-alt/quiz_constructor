import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

export default function Login() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        axios.defaults.withCredentials = true;

        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
            email,
            password,
        })

        if(res.data.success){
            navigate('/');

        } else {
            setError(res.data.message);
        }
    }

    return(
        <div>
            <h2>Log In into account</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} />
                <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} />
                <button type="submit">Log In</button>
                <p>Don't have an account? <a href='/signin'>Create an account!</a></p>
                <p>{error}</p>
            </form>
        </div>
    )
}