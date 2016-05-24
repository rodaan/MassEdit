var Q = require('q');
var Document = require('./documentModel.js');

var findDocument = Q.nbind(Document.findOne, Document);
var createDocument = Q.nbind(Document.create, Document);
var saveDocument = Q.nbind(Document.save, Document);

// finds a document or creates it if it doesn't exist
module.exports = {
	newDocument: function(req, res, next) {
		// var code = req.url;
		var code = 'test' //trial to make sure it works
    findDocument({code: code})
      .then(function(match){
        if(match){
          next(match);
        } else {
        	return code;
        }
      })
      .then(function(code){
      	if(code){
      		var newDocument = {
      			title: 'Test', //ToDo: make it take in title specified by creator
      			code: code,
      			text: '',
      			creator: 'testor' //Todo : make it username
      		};
      		return createDocument(newDocument);
      	}
      })
      .then(function(createdDocument){
      	if(createdDocument) {
      		res.json(createdDocument);
      	}
      })
      .fail(function(error){
      	next(error);
      });
	},
	updateDocument: function(req, res, next) {
    findDocument({code: req.code})
      .then(function(match){
      	console.log(match);
        if(match){
         //  var newDocument = new Document({
         //  	title: req.title, //ToDo: make it take in title specified by creator
      			// code: req.code,
      			// text: req.text,
      			// creator: req.creator //Todo : make it username
         //  });
          match.text = req.text;
          match.save(function(){
          	console.log('record saved', match);
          	next(match);
          });
        } else {
        	res.sendStatus(404);
        }
      })
      // .then(function(savedDocument){
      // 	if(savedDocument){
      // 		console.log('saved document is:', savedDocument);
      // 		res.json(createdDocument);
      // 	}
      // })
      .fail(function(error){
      	next(error);
      });
	}
}