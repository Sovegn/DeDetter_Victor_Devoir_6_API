const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const path = require('path');

const indexRouter = require('./routes/index');
const mongodb = require('./db/mongo');
const dotenv = require('dotenv');

dotenv.config();

mongodb.initClientDbConnection();

const app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(cors({
    exposedHeaders:['Authorization'],
    origin:  '*'
}));
app.use(logger(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        service: process.env.APP_NAME || 'Mon API',
        version: '1.0'
    });
});

// Erreur 404
app.use(function(req, res, next) {
    if (req.headers['accept'] && req.headers['accept'].includes('text/html')) {
        return res.status(404).render('error', {
            title: 'Page non trouvée',
            message: 'La page que vous recherchez n\'existe pas.'
        });
    }
    res.status(404).json({name:'API', version:'1.0', status: 404, message:'not found'});
});

// Erreur 500
app.use(function(err, req, res, next) {
    console.error(err.stack);
    if (req.headers['accept'] && req.headers['accept'].includes('text/html')) {
        return res.status(500).render('error', {
            title: 'Erreur serveur',
            message: 'Une erreur s\'est produite sur le serveur.'
        });
    }
    res.status(500).json({name:'API', version:'1.0', status: 500, message: err.message || 'server error'});
});

module.exports = app;