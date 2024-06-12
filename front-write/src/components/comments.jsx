import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

function Comments() {
    const [post, setPost] = useState('');
    const [comments, setComments] = useState([]);
    const { postid } = useParams();

    async function getPost() {
        let response = await fetch(`http://localhost:3000/posts/${postid}/comments`, {
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
    
    async function deleteHandler(commentid) {
        let response = await fetch(`http://localhost:3000/posts/${postid}/comments/${commentid}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.token
            },
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
                                <br />
                                <button onClick={() => deleteHandler(comment._id)}>DELETE</button>
                                <br /><br />
                            </div>
                        );
                    })}
                </>
            ) : (
                <h1>Loading...</h1>
            )}
        </>
    );
}

export default Comments;
