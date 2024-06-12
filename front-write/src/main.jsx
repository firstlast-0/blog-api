import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import NewPost from './components/new-post';
import EditPost from './components/edit-post';
import Comments from './components/comments';
import './index.css';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
    },
    {
        path: '/posts/create',
        element: <NewPost />,
    },
    {
        path: '/posts/:postid/edit',
        element: <EditPost />,
    },
    {
        path: '/posts/:postid/comments',
        element: <Comments />,
    }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
