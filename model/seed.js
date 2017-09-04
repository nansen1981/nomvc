var db = require("../lib/mysql");
module.exports.list = list;
module.exports.get = get;
module.exports.save = save;
module.exports.update = update;
module.exports.del = del;
function list(){
	return new Promise(function(resolve,rejected) {
		var sql = new db.mysql_db();
		sql.query("select * from dt_seed")
			.then(function(result){
			resolve(result);
		});
	});
}
function get(tag){
	return new Promise(function(resolve,rejected) {
		var sql = new db.mysql_db();
		sql.query("select * from dt_seed where fd_seed_tag = ?",[tag])
			.then(function(result){
			if(result && result.length > 0){
				resolve(result[0]);
			}
			else{
				resolve(null);
			}
		});
	});
}
function save(data){
	return new Promise(function(resolve,rejected) {
		var sql = new db.mysql_db();
		sql.startTrans().then(function(){
			return sql.save({
				"table":"dt_seed",
				fields: data
			});
		}).then(function(){
			return sql.commit();
		}).then(function(result){
			resolve('SUCCESS');
		}).then(function(result){
			return sql.close();
		}).catch(function(err){
			console.log(err);
			sql.rollback().then(function(){
				sql.close();
			});
			rejected(err);
		});
	});
}
function update(data,where){
	return new Promise(function(resolve,rejected) {
		var sql = new db.mysql_db();
		sql.startTrans().then(function(){
			console.log(where);
			return sql.update({
				"table":"dt_seed",
				fields:data,
				wheres:where
			});
		}).then(function(){
			return sql.commit();
		}).then(function(result){
			return sql.close();
		}).then(function(){
			resolve('SUCCESS');
		}).catch(function(err){
			console.log(err);
			sql.rollback().then(function(){
				sql.close();
			});
			rejected(err);
		});
	});
}
function del(tag){
	return new Promise(function(resolve,rejected) {
		var sql = new db.mysql_db();
		sql.startTrans().then(function(){
			return sql.query("delete from dt_seed where fd_seed_tag = ?",[tag]);
		}).then(function(){
			return sql.commit();
		}).then(function(result){
			return sql.close();
		}).then(function(){
			resolve('SUCCESS');
		}).catch(function(err){
			console.log(err);
			sql.rollback().then(function(){
				sql.close();
			});
			rejected(err);
		});
	});
}