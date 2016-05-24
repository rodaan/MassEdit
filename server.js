var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/massedit');

app.use(express.static(__dirname + '/client'))

// require('./config/middleware.js')(app, express);
// require('./server/routes.js')(app, express);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/client/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on 3000');
});