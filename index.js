const express = require('express'),
path = require('path'),
PORT = process.env.PORT || 5000,
config = require('./config')
knox = require('knox'),
fs = require('fs'),
os = require('os'),
formidable = require('formidable'),
gm = require('gm'),
mongoose = require('mongoose').connect(process.env.DB_URL);
require('dotenv').config()

var app = express();
console.log(process.env.S3_KEY)
app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .set('port', PORT)
  .set('host', config.host)


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