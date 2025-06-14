const express = require('express');
const app = express();
const PORT = 3000;

app.use((req, res, next) => {
    console.log(`Request:${req.method} ${req.path}`);
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date();
    console.log(`Time: ${req.requestTime}`);
    next();
});

app.get('/', (req, res) => {
    res.send(`Request received at ${req.requestTime}`);
});

// Error code test
app.get('/error', (req, res, next) => {
    const error = new Error('This is a test error');
    next(error);
});


app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).send('Something went wrong!');
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
