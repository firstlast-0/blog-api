import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

function Home() {
    const [posts, setPosts] = useState([]);

    async function getPosts() {
        let response = await fetch('http://localhost:3000/posts', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.token,
            },
        });
        let data = await response.json();
        setPosts(data.posts);
    }
    
    useEffect(() => {
        getPosts();
    }, []);

    return (
        <>
            <h2>ALL BLOG POSTS</h2>
            {posts.map((post, index) => {
                return (
                    <div key={index}>
                        Title: {post.title}
                        <br />
                        Text: {post.text}
                        <br />
                        <Link to={"/posts/" + post._id + "/comments"}>COMMENTS</Link>
                        <hr />
                    </div>
                    
                );
            })}
        </>
    );
}

export default Home;
