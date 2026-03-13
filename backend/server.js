// load environment from .env file
require('dotenv').config(); // basically this allows us to connect to our MongoDB database

const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']); // setting DNS manually helps Node resolve the Atlas cluster
const express = require('express'); // allows express to run
const mongoose = require('mongoose'); // allows us to connect to MongoDB
const cors = require('cors'); // allows frontend to make requests to backend without CORS issues

const app = express(); // create Express instances
app.use(cors()); // enable CORS so that requests cant be block due to the two different origins (3000 for front, 5000 for back)
app.use(express.json()); // allows Express to parse JSON rquests

const taskRoutes = require('./routes/tasks'); // loads route files
app.use('/api/tasks', taskRoutes); // mounting the routes so that all will be prefixed with /api/tasks

mongoose.connect(process.env.MONGO_URI) // connecting to MongoDB
  .then(() => { // if connection succeeds, start the server
    console.log('✅ MongoDB Connected!');
    app.listen(process.env.PORT, () => {
      console.log("listening on port", process.env.PORT);
    });
  })
  .catch(err => console.error('❌ MongoDB Error:', err.message));

mongoose.connection.on('connected', () => {
  console.log('🎉 Mongoose connected to MongoDB');
});