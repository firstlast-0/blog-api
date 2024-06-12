import { useState } from 'react';
import LoginForm from './components/login-form';
import Home from './components/home';
import './App.css';

function App() {
    const [msg, setMsg] = useState(' ');
    const [access, setAccess] = useState('');

    async function verifyToken() {
        let response = await fetch('https://blog-api-production-7275.up.railway.app/', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.token,
            },
        });
        let data = await response.json();
        setAccess(data.access);
    }
    verifyToken();

    if (!access) {
        return <>
            <LoginForm msg={msg} setMsg={setMsg} setAccess={setAccess} />
        </>;
    } else {
        return <>
            <Home setAccess={setAccess} />
        </>;
    }

    
}

export default App;
