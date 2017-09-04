var db = {
	host : '192.168.1.14',
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