import { useState, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";

function NewPost() {
    const [access, setAccess] = useState('');
    const titleRef = useRef(null);
    const textRef = useRef(null);
    const publishRef = useRef(null);
    const navigate = useNavigate();

    async function verifyToken() {
        let response = await fetch('https://blog-api-production-7275.up.railway.app/posts/create', {
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

    async function createHandler() {
        await fetch('https://blog-api-production-7275.up.railway.app/posts/create', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.token
            },
            body: JSON.stringify( {title: titleRef.current.value, text: textRef.current.value, published: publishRef.current.checked} )
        });
        navigate('/');
    }

    return (<>
        {access ? (
            <>
                <Link to="/">HOME</Link>
                <h1>New Post</h1>
                <form>
                    <label htmlFor="title">Title </label>
                    <input name="title" id="title" ref={titleRef} />
                    <br /><br />
                    <label htmlFor="text">Text </label>
                    <textarea cols={40} rows={15} name="text" id="text" ref={textRef}></textarea>
                    <br />
                    <label htmlFor="publish">Publish?</label>
                    <input type="checkbox" name="publish" id="publish" ref={publishRef} />
                    <br />
                    <br />
                    <button type="button" onClick={() => createHandler()}>Create</button>
                    <br />
                </form>
            </>
        ) : (
            <h1>Log in first</h1>
        )}
    </>)
}

export default NewPost;
