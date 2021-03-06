const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const routes = require('./routes');

require('dotenv').config();

// TODO: Inicializando variable APP
const app = express();

// Para importar la base de datos creada y conectada en el fichero database.js
require('./database');

// TODO: SETTINGS
app.set('port', process.env.PORT || 5000);

// TODO: MIDDLEWARES
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// TODO: ROUTES
app.use('/api', routes);

module.exports = app;