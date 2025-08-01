const express = require('express');
const axios = require('axios');
const app = express();

// Set up view engine
app.set('view engine', 'ejs');

// Serve static files (like CSS)
app.use(express.static('public'));

// Create route for the main page
app.get('/', async (req, res) => {
    try {
        // Make a request to the JokeAPI
        const response = await axios.get('https://v2.jokeapi.dev/joke/Any?type=single');
        const joke = response.data;  // Get the joke data

        // If there's no joke, handle it gracefully
        if (joke.error) {
            res.render('index', { joke: 'Sorry, no joke available at the moment!' });
        } else {
            res.render('index', { joke: joke.joke });
        }
    } catch (error) {
        console.error('Error fetching joke:', error);
        res.render('index', { joke: 'Error fetching joke.' });
    }
});

// Start the server
app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});