import ReactDOM from 'react-dom/client';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import SignIn from "./auth/signin";
import Login from "./auth/login";
import Main from "./main/main";
import Quizzes from "./quizzes/quizzes";
import Start from './quizzes/start';
import CreateQuiz from "./quizzes/createQuiz";
import EditQuiz from "./quizzes/editQuiz";
import Leaderboard from "./quizzes/leaderboard";
import Account from "./auth/account";
import './styles.css';

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Main />} />
            <Route path='/signin' element={<SignIn />} />
            <Route path='/login' element={<Login />} />
            <Route path='/quizzes' element={<Quizzes />} />
            <Route path='/start' element={<Start />} />
            <Route path='/createQuiz' element={<CreateQuiz />} />
            <Route path='/editQuiz' element={<EditQuiz />} />
            <Route path='/leaderboard' element={<Leaderboard />} />
            <Route path='/accountInfo' element={<Account />} />
        </Routes>
    </BrowserRouter>
);