var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var docs = require('./db/documents/documentController.js');

mongoose.connect('mongodb://localhost/massedit');

app.use(express.static(__dirname + '/client'))

var currentUsers = [];
var currentUserCount = 0;

// require('./config/middleware.js')(app, express);
// require('./server/routes.js')(app, express);
var router = express.Router();


router.get('/', function(req, res){
  res.sendFile(__dirname + '/client/index.html');
  // console.log('hallo');
});

app.use('/', router);

io.on('connection', function(socket){
  docs.newDocument(null,null, function(match){
  	currentUserCount += 1;
  	socket.emit('dataFromDB', match);
  	// currentUsers.push('Anonymous');
  	socket.emit('newUser', currentUserCount);
  });

  setInterval(function(){
    socket.broadcast.emit('updatingDoc');
    return false;
  }, 1000);

  socket.on('documentUpdate', function(clientDoc){
    // console.log('message: ' + clientDoc.text);
    var updateObj = {
    	code : 'test',
    	title: 'Cool stuff',
    	creator: 'testor',
    	text: clientDoc.text
    }
    docs.updateDocument(updateObj, null, function(match){
    	// console.log('match is here too!', match);
	    socket.broadcast.emit('dataFromDB', match);
    	
    });
  });

  socket.on('chat message',function(msgObj){
    io.emit('chat message', msgObj);
  });

  socket.on('namedUser', function(username){
  	if(currentUsers.indexOf('Anonymous') > 0){
      currentUsers.splice(currentUsers.indexOf('Anonymous'), 1);
    }
    currentUsers.push(username);
    socket.emit('newUser', currentUsers);
  });
  
  //Remove address list and tells clients to send usernames
  socket.on('disconnect', function(){
  	currentUserCount -= 1;
    console.log('user disconnected');
    // currentUsers = [];
    socket.emit('newUser', currentUserCount - 1);
  });
});

http.listen(3000, function(){
  console.log('listening on 3000');
});