var db = {
	host : '127.0.0.1',
	database : 'dog',
	user : 'dog',
	port : 3306,
	password : '1'
}
var setting = {
	debugSql 	: true,
	root 		: "",
	listen 		: 8081
}
module.exports.db=db;
module.exports.setting=setting;