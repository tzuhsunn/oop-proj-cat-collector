require('dotenv').config();
const cors = require('cors');
const express = require('express');
const path = require('path');
// const userRoutes = require('./routes/user');
const catRoutes = require('./routes/cat');

const app = express();
const port = 3001;
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// set up CORS
app.use(cors({
  origin: ['http://localhost:3030', 'http://localhost', 'https://tzuhsun.online'],
  credentials: true,
}));

// Use the user routes
// app.use('/1.0/user', userRoutes);
app.use('/1.0/cat', catRoutes);

app.get('/', (req, res) => {
    res.send('Node.js and Express REST API server is running!');
});

app.get('/healthcheck', (req, res) => {
    res.send('backend OK');
});

app.listen(port, () => {
    console.log(`It is running on ${port}`);
});