var express = require('express');
var mongoose = require('mongoose');
var app = express();
var http = require('http').Server(app);

app.use(express.static(__dirname + '/client'))


app.get('/', function(req, res){
  res.sendFile(__dirname + '/client/index.html');
});

http.listen(3000, function(){
  console.log('listening on 3000');
});