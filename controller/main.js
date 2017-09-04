var mvc      = require('../lib/mvc');
function index(req,res){
	console.log("index");
	res.viewBag.name = "hello";
	mvc.view(res,"main/index");
}
function test(req,res){
	console.log("test");
	console.log(req.body);
	console.log(req.paras);
	console.log(req.query);
	mvc.json(res,{ name: 'Hey', message: 'Hello there!'});
}
function testStr(req,res){
	mvc.text(1);
}
function db(req,res){
	var seed = require("../model/seed");
	seed.get().then(function(result){
		mvc.json(res,result);
	}).catch(function(err){
		mvc.error(res,err);
	});
}
module.exports.index = index;
module.exports.test = test;
module.exports.testStr = testStr;
module.exports.db = db;