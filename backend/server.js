require('dotenv').config()

const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const express = require('express')
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected!'))
  .catch(err => console.error('❌ MongoDB Error:', err.message));

mongoose.connection.on('connected', () => {
  console.log('🎉 Mongoose connected to MongoDB');
});

const workoutRoutes = require('./routes/workouts')
//express app
const app = express();

//middleware
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

//routes
app.use('/api/workouts', workoutRoutes)

//connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        //listen for requests
        app.listen(process.env.PORT, () => {
            console.log("listening on port ", process.env.PORT)
    })

    })
    .catch((error) => {
        console.log(error)
    })  


