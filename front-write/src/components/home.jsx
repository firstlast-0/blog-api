import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

function Home({ setAccess }) {
    const [posts, setPosts] = useState([]);

    async function getPosts() {
        let response = await fetch('https://blog-api-production-7275.up.railway.app/posts', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.token,
            },
        });
        let data = await response.json();
        setPosts(data.posts);
    }

    async function deleteHandler(id) {
        let response = await fetch(`https://blog-api-production-7275.up.railway.app/posts/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.token
            },
        });
        let data = await response.json();
        setPosts(data.posts);
    }

    async function publishHandler(id) {
        let response = await fetch(`https://blog-api-production-7275.up.railway.app/posts/${id}/publish`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.token
            },
        });
        let data = await response.json();
        setPosts(data.posts);
    }

    useEffect(() => {
        getPosts();
    }, []);

    function logoutHandler() {
        localStorage.clear();
        setAccess('');
    }

    return (
        <>
            <Link to="/posts/create"><button>NEW POST</button></Link>
            <Link to="/"><button onClick={() => logoutHandler()}>LOGOUT</button></Link>
            <br /><br />
            {posts.map((post, index) => {
                return (
                    <div key={index}>
                        Title: {post.title}
                        <br />
                        Text: {post.text}
                        <br />
                        Published: {post.published ? 'Yes' : 'No'}
                        <br />
                        <Link to={"/posts/" + post._id + "/edit"}><button>EDIT</button></Link>
                        <button onClick={() => deleteHandler(post._id)}>DELETE</button>
                        <Link to={"/posts/" + post._id + "/comments"}><button>COMMENTS</button></Link>
                        <button onClick={() => publishHandler(post._id)}>PUBLISH/UNPUBLISH</button>
                        <hr />
                    </div>
                    
                );
            })}
        </>
    );
}

export default Home;
