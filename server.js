var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var docs = require('./db/documents/documentController.js');

mongoose.connect('mongodb://localhost/massedit');

app.use(express.static(__dirname + '/client'))

// require('./config/middleware.js')(app, express);
// require('./server/routes.js')(app, express);
var router = express.Router();


router.get('/', function(req, res){
  res.sendFile(__dirname + '/client/index.html');
  console.log('hallo');
});

app.use('/', router);

io.on('connection', function(socket){
  docs.newDocument(null,null, function(match){
  	socket.emit('dataFromDB', match);
  });

  setInterval(function(){
    socket.broadcast.emit('updatingDoc');
    return false;
  }, 1000);

  socket.on('documentUpdate', function(clientDoc){
    console.log('message: ' + clientDoc.text);
    var updateObj = {
    	code : 'test',
    	title: 'Cool stuff',
    	creator: 'testor',
    	text: clientDoc.text
    }
    docs.updateDocument(updateObj, null, function(match){
    	console.log('match is here too!', match);
	    socket.broadcast.emit('dataFromDB', match);
    	
    });
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on 3000');
});