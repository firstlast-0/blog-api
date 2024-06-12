import { useState, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

function Comments() {
    const [post, setPost] = useState('');
    const [comments, setComments] = useState([]);
    const unameRef = useRef(null);
    const msgRef = useRef(null);
    const { postid } = useParams();

    async function getPost() {
        let response = await fetch(`https://blog-api-production-7275.up.railway.app/posts/${postid}/comments`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
        let data = await response.json();
        setPost(data.post);
        setComments(data.comments);
    }

    useEffect(() => {
        getPost();
    }, []);
    
    async function addHandler() {
        let response = await fetch(`https://blog-api-production-7275.up.railway.app/posts/${postid}/comments/create`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: unameRef.current.value, text: msgRef.current.value }),
        });
        let data = await response.json();
        setComments(data.comments);
    }

    return (
        <>
            {post ? (
                <>
                    <Link to="/">HOME</Link>
                    <br /><br />
                    Title: {post.title}
                    <br />
                    Text: {post.text}
                    <br />
                    <h2>Comments</h2>
                    {comments.map((comment, index) => {
                        return (
                            <div key={index}>
                                Username: {comment.username}
                                <br />
                                Message: {comment.text}
                                <br /><br />
                            </div>
                        );
                    })}
                    <br /><hr />
                    <label htmlFor="username">Username </label>
                    <input name="username" id="username" ref={unameRef} />
                    <br /><br />
                    <label htmlFor="msg">Message </label>
                    <textarea cols={40} rows={7} name="msg" id="msg" ref={msgRef}></textarea>
                    <br /><br />
                    <button type="button" onClick={() => addHandler()}>Add Comment</button>
                    <br />
                </>
            ) : (
                <h1>Loading...</h1>
            )}
        </>
    );
}

export default Comments;
