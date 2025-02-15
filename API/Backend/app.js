const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');


const authRoutes = require('./routes/authRoutes');
const catwaysRoutes = require('./routes/catwaysRoutes');
const reservationsRoutes = require('./routes/reservationsRoutes');
const usersRoutes = require('./routes/usersRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/catways', catwaysRoutes);
app.use('/api/catways', reservationsRoutes);
app.use('/api/users', usersRoutes);

module.exports = app;

