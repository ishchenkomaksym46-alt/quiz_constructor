import axios from "axios";
import {useState} from "react";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    async function handleSignIn(e: React.FormEvent) {
        e.preventDefault();

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/signin`, {
                username: username,
                password: password,
                email: email,
            });

            if(res.data.success){
                navigate('/');
            } else {
                setError(res.data.message);
            }
        } catch (error: any) {
            setError(error.message + '!');
        }
    }

    return (
        <div>
            <h2>Create new account</h2>
            <form onSubmit={handleSignIn}>
                <input type="text" name="username" placeholder="Username" onChange={(e) => setUsername(e.target.value)} minLength={3} required/>
                <input type="email" name="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} minLength={3} required/>
                <input type="password" name="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} minLength={5} required/>
                <button type="submit">Create account</button>
                <p>Have an account? <a href='/login'>Log In!</a></p>
                <p>{error}</p>
            </form>
        </div>
    )
}