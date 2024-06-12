var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = require('./models/user');
const Post = require('./models/post');
const Comment = require('./models/comment');
const jwt = require('jsonwebtoken');
var cors = require('cors')

const mongoDb = 'mongodb+srv://user:admin123@cluster0.hiiatiy.mongodb.net/blog-api?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoDb);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            res.json({ access: false });
            // res.sendStatus(403);
        } else {
            res.json({ access: true });
        }
    });
});

app.post('/', async (req, res) => {
    let user = await User.findOne({ username: req.body.username });

    if (req.body.username === 'q' && req.body.password === 'q') {
        jwt.sign({ user }, 'secretkey', (err, token) => {
            res.json( {token} );
        });
    } else {
        res.json( {message: 'Invalid username/password'} );
    }
    
});

app.get('/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            const posts = await Post.find({ published: true });
            res.json({ posts });
        } else {
            const posts = await Post.find({ });
            res.json({ posts });
        }
    });
});

app.get('/posts/create', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({ access: true });
        }
    });
});

app.post('/posts/create', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            let post1 = new Post({ title: req.body.title, text: req.body.text, published: req.body.published });
            await post1.save();
            res.json({ message: true });
        }
    });
});

app.delete('/posts/:postid', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            await Post.findByIdAndDelete(req.params.postid)
            const posts = await Post.find({});
            res.json({ posts });
        }
    });
});

app.put('/posts/:postid/publish', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            let post1 = await Post.findById(req.params.postid);
            if (post1.published) {
                await Post.findByIdAndUpdate(post1._id, {published: false});
            } else {
                await Post.findByIdAndUpdate(post1._id, {published: true});
            }
            const posts = await Post.find({});
            res.json({ posts });
        }
    });
});

app.get('/posts/:postid/edit', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            res.json({ access: false });
        } else {
            let post1 = await Post.findById(req.params.postid);
            res.json({ access: true, post: post1 });
        }
    });
});

app.put('/posts/:postid/edit', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            let post1 = new Post({ _id: req.params.postid, title: req.body.title, text: req.body.text, published: req.body.published });
            await Post.findByIdAndUpdate(req.params.postid, post1);
            res.json({ });
        }
    });
});

app.delete('/posts/:postid/comments/:commentid', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            await Comment.findByIdAndDelete(req.params.commentid);
            let comments = await Comment.find({ on: req.params.postid });
            res.json({ comments });
        }
    });
});

// Read routes
app.get('/posts/:postid/comments', async (req, res) => {
    let post1 = await Post.findById(req.params.postid).exec();
    let comments = await Comment.find({ on: post1._id });
    res.json({ access: true, post: post1, comments });
});

app.post('/posts/:postid/comments/create', async (req, res) => {
    const post1 = await Post.findOne({ _id: req.params.postid });
    let comment1 = new Comment({ username: req.body.username, text: req.body.text, on: post1._id })
    await comment1.save();
    let comments = await Comment.find({ on: post1._id });
    res.json({ comments });
});

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

// app.post(
//     '/log-in',
//     passport.authenticate('local', {
//         successRedirect: '/',
//         failureRedirect: '/',
//     })
// );

// app.get('/log-out', (req, res, next) => {
//     req.logout((err) => {
//         if (err) {
//             return next(err);
//         }
//         res.redirect('/');
//     });
// });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
