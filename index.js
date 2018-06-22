//import { createServer } from 'tls';

const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

var app = express();

app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .set('port', process.env.PORT || 3000);

  //declare router and render index page

  var router = express.Router();

  router.get('/', function(req,res,next){
    res.render('index',{})
  });

  // get the server working with the app

app.use('/',router);

var server = require('http').createServer(app);
var io = require('socket.io')(server);

server.listen(app.get('port'), () => {
  console.log(`Photogrid Listening on ${ PORT }`)
});