const express = require('express'),
path = require('path'),
PORT = process.env.PORT || 5000,
config = require('./config')
knox = require('knox'),
fs = require('fs'),
os = require('os'),
formidable = require('formidable'),
gm = require('gm'),
mongoose = require('mongoose').connect("mongodb://ebn646:enen6767@ds159110.mlab.com:59110/photogrid646")

var app = express();

app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .set('port', process.env.PORT || 3000)
  .set('host', config.host)


var knoxClient = knox.createClient({
	key: "AKIAI5ZS2OJCSP3IW4WA",
	secret: "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",
	bucket: "photogrid646"
})

//declare router and render index page

var server = require('http').Server(app);
var io = require('socket.io')(server);

require('./routes')(express, app, formidable, fs, os, gm, knoxClient, mongoose, io);

server.listen(app.get('port'), () => {
  console.log(`Photogrid Listening on ${ PORT }`)
});