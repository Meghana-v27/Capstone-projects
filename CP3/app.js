const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');

const app = express();
const port = 8000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); 

let posts = [];
app.get('/', (req, res) => {
    res.render('home', { posts: posts, errorMessage: null }); // Or errorMessage: undefined, or simply don't pass it if you adjust the EJS
});

app.get('/compose', (req, res) => {
    res.render('compose');
});

app.post('/compose', (req, res) => {
    const post = {
        title: req.body.postTitle,
        content: req.body.postBody
    };
    posts.push(post);
    res.redirect('/');
});

app.get('/posts/:postTitle', (req, res) => {
    const requestedTitle = req.params.postTitle;
    const post = posts.find(p => p.title.toLowerCase().replace(/ /g, '-') === requestedTitle);

    if (post) {
        res.render('post', { post: post });
    } else {
        res.render('home', { posts: posts, errorMessage: 'Post not found.' });
    }
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});