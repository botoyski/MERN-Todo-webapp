require('dotenv').config();

const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // <-- Add this line

const app = express();
app.use(cors()); // <-- Add this line
app.use(express.json());

const taskRoutes = require('./routes/tasks');
app.use('/api/tasks', taskRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected!');
    app.listen(process.env.PORT, () => {
      console.log("listening on port", process.env.PORT);
    });
  })
  .catch(err => console.error('❌ MongoDB Error:', err.message));

mongoose.connection.on('connected', () => {
  console.log('🎉 Mongoose connected to MongoDB');
});