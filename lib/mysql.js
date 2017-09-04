var mysql      = require('mysql');
var config      = require('../config');
var log4      = require('./log4').log4;
function mysql_db(host,user,password,database){
	if(!host){
		host = config.db.host;
		user = config.db.user;
		password = config.db.password;
		database = config.db.database;
	}
	this._connection_ = mysql.createConnection({
	  host     : host,
	  user     : user,
	  password : password,
	  database : database
	});
	this._connection_.connect();
	this._trans_ = {};
}
mysql_db.prototype.query = function(sql,paras){
	var connection = this._connection_;
	
	return new Promise(function(resolve,rejected) {
		console.log();
		writeLog(sql,paras);
		connection.query(sql,paras,function (err, result) {
			if(err){
			  return rejected(err);
			}
			return resolve(result);
		});
	});
}
mysql_db.prototype.save = function(data){
	var connection = this._connection_;
	return new Promise(function(resolve,rejected) {
		var sql = "insert into {0} ({1}) values ({2})";
		sql = sql.replace("{0}",data.table);
		var paraKeys = [];
		var paraPlaces = [];
		var paraValues = [];
		for(var key in data.fields){
			paraKeys.push(key);
			paraValues.push(data.fields[key]);
			paraPlaces.push("?");
		}
		sql = sql.replace("{1}",paraKeys.join(","));
		sql = sql.replace("{2}",paraPlaces.join(","));
		writeLog(sql,paraValues);
		connection.query(sql,paraValues,function (err, result) {
			if(err){
			  return rejected(err);
			}
			return resolve(result);
		});
	});
}
mysql_db.prototype.update = function(data){
	var connection = this._connection_;
	return new Promise(function(resolve,rejected) {
		var sql = "update {0} set {1} where {2}";
		sql = sql.replace("{0}",data.table);
		var paraKeys = [];
		var paraValues = [];
		for(var key in data.fields){
			paraKeys.push(key + "=?");
			paraValues.push(data.fields[key]);
		}
		var whereKeys = [];
		for(var key in data.wheres){
			whereKeys.push(key + "=?");
			paraValues.push(data.wheres[key]);
		}
		sql = sql.replace("{1}",paraKeys.join(","));
		sql = sql.replace("{2}",whereKeys.join(","));
		console.log(JSON.stringify(paraValues));
		writeLog(sql,paraValues);
		connection.query(sql,paraValues,function (err, result) {
			if(err){
			  return rejected(err);
			}
			return resolve(result);
		});
	});
}
mysql_db.prototype.startTrans = function(){
	var trans = this._trans_;
	var connection = this._connection_;
	return new Promise(function(resolve,rejected) {
		connection.beginTransaction(function(err){
			if(err){ throw err; }
			trans.state = "START";
			resolve();
		});
	});
};
mysql_db.prototype.rollback = function(){
	var trans = this._trans_;
	console.log("rollback");
	var connection = this._connection_;
	return new Promise(function(resolve,rejected) {
		if(trans.state == "START"){
			connection.rollback(function(err){
				if(err){ throw err; }
				trans.state = "ROLLBACK";
				resolve();
			});
		}else{
			resolve();
		}
	});
};
mysql_db.prototype.commit = function(){
	var trans = this._trans_;
	console.log("commit");
	var connection = this._connection_;
	return new Promise(function(resolve,rejected) {
		if(trans.state == "START"){
			connection.commit(function(err){
				if(err){ throw err; }
				trans.state = "COMMIT";
				resolve();
			});
		}else{
			rejected(new Error('TRANS ERROR'));
		}
	});
};
mysql_db.prototype.close = function(){
	console.log("close");
	var trans = this._trans_;
	var connection = this._connection_;
	return new Promise(function(resolve,rejected) {
		if(trans.state == "START"){
			connection.rollback(function(err){
				if(err){ throw err; }
				trans.state = "ROLLBACK";
				connection.end();
				resolve();
			});
		}else{
			connection.end();
			resolve();
		}
	});
};
function writeLog(sql,paras){
	if(config.setting.debugSql){
		var charNum = 0;
		var log = sql.replace(/\?/g,function(s){
			var typeStr = typeof(paras[charNum]);
			charNum++;
			if(typeStr == "string"){
				return "'" + paras[charNum-1].toString() + "'";
			}else{
				return paras[charNum-1].toString();
			}
		});
		log4.sql(log);
	}
};
module.exports.mysql_db = mysql_db;