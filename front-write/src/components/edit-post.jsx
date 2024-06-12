import { useState, useRef } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";

function EditPost() {
    const [post, setPost] = useState({});
    const [access, setAccess] = useState('');
    const titleRef = useRef(null);
    const textRef = useRef(null);
    const publishRef = useRef(null);
    const navigate = useNavigate();
    const { postid } = useParams();

    async function verifyToken() {
        let response = await fetch(`https://blog-api-production-7275.up.railway.app/posts/${postid}/edit`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.token,
            },
        });
        let data = await response.json();
        setAccess(data.access);
        setPost(data.post);
    }
    verifyToken();

    async function editHandler() {
        await fetch(`https://blog-api-production-7275.up.railway.app/posts/${postid}/edit`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.token
            },
            body: JSON.stringify({ title: titleRef.current.value, text: textRef.current.value, published: publishRef.current.checked })
        });
        navigate('/');
    }

    return (<>
        {access ? (
            <>
                <Link to="/">HOME</Link>
                <h1>Edit Post</h1>
                <form>
                    <label htmlFor="title">Title </label>
                    <input name="title" id="title" ref={titleRef} defaultValue={post.title} />
                    <br /><br />
                    <label htmlFor="text">Text </label>
                    <textarea cols={40} rows={15} name="text" id="text" ref={textRef} defaultValue={post.text}></textarea>
                    <br />
                    <label htmlFor="publish">Publish?</label>
                    {post.published ?
                    (<input type="checkbox" name="publish" id="publish" ref={publishRef} defaultChecked />) :
                    <input type="checkbox" name="publish" id="publish" ref={publishRef} /> }
                    <br />
                    <br />
                    <button type="button" onClick={() => editHandler()}>Confirm</button>
                    <br />
                </form>
            </>
        ) : (
            <h1>Log in first</h1>
        )}
    </>)
}

export default EditPost;
