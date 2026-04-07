import ReactDOM from 'react-dom/client';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import SignIn from "./auth/signin";
import Login from "./auth/login";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
    <BrowserRouter>
        <Routes>
            <Route path='/signin' element={<SignIn />} />
            <Route path='/login' element={<Login />} />
        </Routes>
    </BrowserRouter>
);