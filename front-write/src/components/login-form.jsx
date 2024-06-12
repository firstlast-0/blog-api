import { useRef } from 'react';

function LoginForm( {msg, setMsg, setAccess} ) {
    
    const nameRef = useRef(null);
    const passRef = useRef(null);

    async function loginHandler() {
        let response = await fetch('http://localhost:3000/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( {username: nameRef.current.value, password: passRef.current.value} )
        });
        let data = await response.json();
        if (data.message) {
            setMsg(data.message);
            setAccess(false);
        } else {
            localStorage.token = data.token;
            setMsg('');
            setAccess(true);
        }
        
    }

    return <>
        <h1>Log in</h1>
        <form>
            <label htmlFor="username">Username</label>
            <input name="username" id="username" ref={nameRef} />

            <label htmlFor="password">Password</label>
            <input name="password" type="password" id="password" ref={passRef} />

            <button type='button' onClick={() => loginHandler()}>Log In</button>
            <br />
            <span>{msg}</span>
        </form>
    </>;
}

export default LoginForm;
