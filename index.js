const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const port = process.env.PORT || 3000;
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const User = require('./routes/user.route');
const Project = require('./routes/project.route');
const Task = require('./routes/task.route');
connectDB();
app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define routes
app.use('/user', User);
app.use('/project', Project);
app.use('/task', Task);

app.listen(port, (error) => {
  error ? console.log(error) : console.log(`server started on: ${port}`);
});