require('dotenv').config()

const express = require('express'),
path = require('path'),
PORT = process.env.PORT || 5000,
config = require('./config')
knox = require('knox'),
fs = require('fs'),
os = require('os'),
formidable = require('formidable'),
gm = require('gm'),
bodyParser = require('body-parser'),
mongoose = require('mongoose').connect(process.env.DB_URL),
session = require('express-session');
MongoStore = require('connect-mongo')(session);

var app = express();
//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}));

// parse incoming login requests requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', PORT);
app.set('host', config.host)


var knoxClient = knox.createClient({
	key: process.env.S3_KEY,
	secret: process.env.S3_SECRET,
	bucket: process.env.S3_BUCKET
})

//declare router and render index page

var server = require('http').Server(app);
var io = require('socket.io')(server);

require('./routes/router')(express, app, formidable, fs, os, gm, knoxClient, mongoose, io);

server.listen(app.get('port'), () => {
  console.log(`Photogrid Listening on ${ PORT }`)
});