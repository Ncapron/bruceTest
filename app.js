require('app-module-path').addPath(__dirname + '/');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const session = require('express-session');
const config = require('config');
const bluebird = require('bluebird');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const _ = require('lodash');

//DB
const hosts = config.get('mongo.host') + ':' + config.get('mongo.port');

let mongoPath = 'mongodb://@' + hosts + '/' + config.mongo.bdd;

mongoose.Promise = bluebird;
mongoose.connect(mongoPath);
mongoose.set('debug', config.debug);

let db = mongoose.connection;

db.on('error', function () {
    console.error.bind(console, 'connection error:');
});
db.once('open', function () {
    console.log('Database connected !');
});
//DB

// SESSION ==========================
if (config.security) {
    app.use(session({
        secret: config.security.session.secret,
        saveUninitialized: true, // don't create session until something stored
        resave: false, //don't save session if unmodified
        store: new MongoStore({mongooseConnection: mongoose.connection})
    }));
}
// ==================================

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// ROUTES ===========================
app.use(require('./routes/routes'));
// ==================================

// SERVER ===========================
app.listen(config.port || 9999, function () {
    if (_.isEmpty(config)){
        console.log('The config files are not created yet');
        process.exit(1);
    }

    console.log('Server is runnig on port', config.port || 9999);
});
// ==================================

module.exports = app;
