const express = require('express');
const app = express();
const PORT = 3000;



const users = [
    {id: 1, name: 'Bob'},
    {id: 2, name: 'Steve'},
];

app.use(express.static('public'));
app.use(express.json());


app.set('view engine', 'ejs');
app.get('/users-view', (req, res) => {
    res.render('users', {users});
})




app.use((req, res, next) => {
    console.log(`Request:${req.method} ${req.path}`);
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date();
    console.log(`Time: ${req.requestTime}`);
    next();
});

// Data Category

// const users = [
//     {id: 1, name: 'Bob'},
//     {id: 2, name: 'Steve'},
// ];

// Client create new data

app.post ('/users', (req, res) => {
    const{ name } = req.body;
    if (!name) {
        return res.status(400).json({error: 'Enter the name...'});
    }
    const newUser = {
        id: users.length + 1,
        name
    };
    users.push(newUser);
    res.status(201).json(newUser);
});

// Client PATCH

app.patch('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const {name} = req.body;

    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).json({error: 'User not found'});
    }
    if (name) {
        user.name = name;
    }
    res.json(user);
});

// Client DELETE user 

app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);

    if(userIndex === -1) {
        return res.status(404).json({error: 'User not found'});
    }

    const delUser = users.splice(userIndex, 1)[0];
    res.json({message: 'User deleted', user: delUser});
});



const posts = [
    {id: 1, userId: 1, title: 'Hello World!'},
    {id: 2, userId: 2, title: 'This is working'},
];

const comments = [
    {id: 1, postId: 1, content: 'Great'},
    {id: 2, postId: 1, content: 'Awesome!'}
];

// Routes for category
app.get('/users', (req, res) => {
    res.json(users);
});

// Query parameters for data filtering

app.get('/posts', (req, res) => {
    const {userId} = req.query;

    if(userId) {
        const filteredPosts = posts.filter(p => p.userId === parseInt(userId));
        return res.json(filteredPosts);
    }

    res.json(posts);
});

app.get('/comments', (req, res) => {
    res.json(comments);
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


// Use static files 

// app.use(express.static('public'));



const challenges = [
  { id: 1, text: 'Do 10 pushups' },
  { id: 2, text: 'Drink 2 liters of water' }
];

app.get('/challenges_view', (req, res) => {
  res.render('users', { users });
});

app.post('/challenges', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).send('Please enter a challenge.');
  }
  const newChallenge = {
    id: challenges.length + 1,
    text
  };
  challenges.push(newChallenge);
  res.redirect('/challenges_view');
});