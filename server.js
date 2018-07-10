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
  webpackDevMiddleware = require('webpack-dev-middleware'),
  webpack = require('webpack'),
  session = require('express-session'),
  http = require('http'),
  https = require('https');

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

// Set up webpack middleware
console.log('process =', process.env.NODE_ENV)
// if (process.env.NODE_ENV == 'development') {
//   app.use(webpackDevMiddleware(webpack(require('./webpack.dev.config.js')), {
//     mode: 'development',
//     filename: 'bundle.js',
//     publicPath: '/public',
//     stats: {
//       colors: true,
//     },
//     historyApiFallback: true,
//   }));
// }

//apply custom middleware to see if user is logged in

app.use(function (req, res, next) {
  //set global var to see if user is logged in
  app.locals.isAuthenticated = req.session.userId;
  next();
})



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
if (process.env.NODE_ENV = 'development') {
  var server = https.createServer({
    key:fs.readFileSync('./https/key.pem'),
    cert:  fs.readFileSync('./https/cert.pem'),
    secure: true
  }, app);

  var io = require('socket.io').listen(server);

  require('./routes/router')(express, app, formidable, fs, os, gm, knoxClient, mongoose, io);

  server.listen(app.get('port'), () => {
    console.log(`Photogrid Listening on ${PORT}`)
  });

} else {
  var server = require('http').Server(app);
  var io = require('socket.io')(server);

  require('./routes/router')(express, app, formidable, fs, os, gm, knoxClient, mongoose, io);

  server.listen(app.get('port'), () => {
    console.log(`Photogrid Listening on ${PORT}`)
  });
}

