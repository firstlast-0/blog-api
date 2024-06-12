import { useState } from 'react';
import LoginForm from './components/login-form';
import Home from './components/home';
import './App.css';

function App() {
    const [msg, setMsg] = useState(' ');
    const [access, setAccess] = useState('');
    // async function getdata() {
    //     let x = await fetch('http://localhost:3000/posts');
    //     x = await x.json();    
    //     console.log(x);
    // }
    // getdata();

    async function verifyToken() {
        let response = await fetch('http://localhost:3000/', {
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
