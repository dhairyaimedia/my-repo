const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5555;
const uri = 'mongodb://advance-mongodb-service:27017/test';
const User = require('./modals/userModal');
const cors = require('cors')
const bodyParser = require('body-parser')


app.use(cors({
    origin: "*"
}))
app.use(bodyParser.json())
let msg = ""
// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected successfully to MongoDB');
        msg = "SUCCESS"
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB:', error);
        msg = "ERROR"
    });// Define a route

app.get('/', (req, res) => {
    res.send(msg);
});

app.get('/api/get-users', (req, res) => {
    // Query the 'my_collection' collection to retrieve all users
    User.find()
        .then(users => {
            console.log("usrs", users)
            // Return the retrieved users as the API response
            res.json(users);
        })
        .catch(error => {
            // Handle errors
            console.error('Error retrieving users:', error);
            res.status(500).json({ error: 'An error occurred while retrieving users' });
        });
});

app.post('/api/add-user', async (req, res) => {
    try {
        // Create a new user instance
        console.log("body",req.body)
        console.log("query",req.method)

        const user = new User(req.body);
        // Save the user to the database
        await user.save();
        // Respond with a success message
        res.status(201).json({ message: 'User added successfully', user });
    } catch (err) {
        // If an error occurs, respond with an error message
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
