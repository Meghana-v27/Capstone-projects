// app.js
const express = require('express');
const { Client } = require('pg');
const path = require('path');

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const client = new Client({
    user: 'postgres', // Replace with your PostgreSQL user
    host: 'localhost',
    database: 'book_tracker',
    password: 'admin', // Replace with your PostgreSQL password
    port: 5432,
});

client.connect();

// Routes
app.get('/', async (req, res) => {
    try {
        const booksResult = await client.query('SELECT * FROM books');
        const books = booksResult.rows.map(book => {
            const publicationDate = new Date(book.publication_date);
            const formattedDate = publicationDate.toLocaleDateString();
            return { ...book, publication_date: formattedDate };
        });
        res.render('index', { books: books });
    } catch (err) {
        console.error(err);
        res.send('Error fetching books.');
    }
});

app.post('/add-book', async (req, res) => {
    try {
        const { title, author, publication_date } = req.body;
        await client.query(
            'INSERT INTO books (title, author, publication_date) VALUES ($1, $2, $3)',
            [title, author, publication_date]
        );
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.send('Error adding book.');
    }
});

app.post('/add-review', async (req, res) => {
    try {
        const { book_id, rating, read_date } = req.body;

        if (!rating || isNaN(rating)) {
            return res.status(400).send('Invalid rating value.');
        }

        await client.query(
            'INSERT INTO reviews (book_id, rating, read_date) VALUES ($1, $2, $3)',
            [book_id, parseInt(rating), read_date]
        );
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.send('Error adding review.');
    }
});

// Delete book route
app.post('/delete-book/:id', async (req, res) => {
    try {
        const bookId = req.params.id;
        console.log("Deleting book with ID:", bookId);
        // Delete related reviews first
        await client.query('DELETE FROM reviews WHERE book_id = $1', [bookId]);
        await client.query('DELETE FROM books WHERE id = $1', [bookId]);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.send('Error deleting book.');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});