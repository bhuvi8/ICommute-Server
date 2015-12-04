/*
    ICommute-server - An application to track organizational transport vehicles
    Copyright (C) 2015  busktimachu

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
    app-engine.js : processes requests and sends appropriate response to caller

*/
var config = require('../config');
var mongo = require('mongodb');
var path = require('path');
var fs = require('fs');

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var db;

var url = 'mongodb://' + config.db_server + ':'+config.db_port+'/'+config.db_name;
var route_file_path = __dirname + config.data_path + config.data_file;
var route_file = path.normalize(route_file_path);
var id_collection = 'id_mapping';

MongoClient.connect(url, function(err, database) {
   assert.equal(null, err);
   db = database;
   db.collection(id_collection, {strict:true}, function(err,collection) {
	if (err) {
	 console.log(id_collection+" collection doesn't exist. Creating it...");
	}
   });
   console.log("Connected to server "+ url);
});
       
var ObjectID = mongo.ObjectID;

exports.checkUid = function(req, res) {
	console.log(req.query)
	var u_id;
	if (req.query.u_id && req.query.u_id.length == 26) { 
		u_id = req.query.u_id.replace(/[^a-fA-F0-9]/g, '')
	} else {
		res.status(403);
		return;
	}
	console.log('Retrieving u_id: ' + u_id);
	db.collection(id_collection, function(err,collection) {
		collection.findOne({'_id':new ObjectID(u_id)}, function(err, result) {
			if (err) {
				res.send({"error":"An error occured"});
			} else {
				if (result) {
					console.log('res:'+result);
					res.send(result._id);
				} else {
					res.status(403);
				}
			}
		});
	});
};

exports.register = function(req,res) {
	console.log(req.query)
	var emp_id = req.query;
	console.log("registering emp_id: " + JSON.stringify(emp_id));
	db.collection(id_collection, function(err,collection) {
		collection.insert(emp_id, {safe:true}, function(err,result) {
			if (err) {
				res.send({"error":"Registration failed"});
			} else {
				console.log("success" +JSON.stringify(result.insertedIds[0]));
				res.send(result.insertedIds[0]);
			}
		});
	});
};

exports.sendhash = function(req, res) {
	console.log(req.query)
	var u_id;
	if (req.query.u_id && req.query.u_id.length == 26) { 
		u_id = req.query.u_id.replace(/[^a-fA-F0-9]/g, '')
	} else {
		res.status(403);
		return;
	}
	db.collection(id_collection, function(err,collection) {
		collection.findOne({'_id':new ObjectID(u_id)}, function(err, result) {
			if (err) {
				res.send({"error":"Not registered"});
			} else {
				if (result) {
					console.log('Retrieving hash for u_id: ' + u_id);
					var checksum = require('checksum');
					var cksum = checksum.file(route_file,function(err,chksum){
						res.send(chksum);
					});
				} else {
					res.status(403);
				}				
			}
		});
	});
	//res.send(cksum);
}

exports.Sendfile = function(req, res) {
	console.log(req.query)
	var u_id;
	if (req.query.u_id && req.query.u_id.length == 26) { 
		u_id = req.query.u_id.replace(/[^a-fA-F0-9]/g, '')
	} else {
		res.status(403);
		return;
	} 
	db.collection(id_collection, function(err,collection) {
		collection.findOne({'_id':new ObjectID(u_id)}, function(err, result) {
			if (err) {
				res.send({"error":"Not registered"});
			} else {
				if (result) {
					console.log('sending route file for u_id: ' + u_id);
					//var mimetype = mime.lookup(file);
					var mimetype = "application/x-download"
					res.setHeader('Content-disposition', 'attachment; filename=' + config.data_file);
					res.setHeader('Content-type', mimetype);
					var filestream = fs.createReadStream(route_file);
					filestream.pipe(res);
				} else {
					res.status(403);
				}
			}
		});
	});
}	

