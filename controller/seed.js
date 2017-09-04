var mvc      = require('../lib/mvc');
var log4      = require('../lib/log4').log4;
function list(req,res){
	var seed = require("../model/seed");
	seed.list().then(function(result){
		res.viewBag.list = result;
		mvc.view(res);
	}).catch(function(err){
		
		log4.error(err.stack);
		mvc.error(res,err);
	});
}
function edit(req,res){
	var seed = require("../model/seed");
	seed.get(req.query.tag).then(function(result){
		if(result){
			res.viewBag.seed = result;
			mvc.view(res);
		}else{
			throw new Error("record don't exist");
		}
	}).catch(function(err){
		mvc.error(res,err);
	});
}
function save(req,res){
	var seed = require("../model/seed");
	seed.get(req.body.tag).then(function(result){
		if(result){
			return seed.update(
				{
					"fd_seed_index" : req.body.index
				},{
					"fd_seed_tag" : req.body.tag
				}
			);
		}else{
			return seed.save(
				{
					"fd_seed_index" : req.body.index,
					"fd_seed_tag" : req.body.tag
				}
			);
		}
	}).then(function(result){
		mvc.text(res,result);
		log4.info("save success");
	}).catch(function(err){
		mvc.error(res,err);
	});
}
function del(req,res){
	var seed = require("../model/seed");
	seed.del(req.query.tag).then(function(result){
		mvc.text(res,result);
	}).catch(function(err){
		mvc.error(res,err);
	});
}
module.exports.list = list;
module.exports.edit = edit;
module.exports.save = save;
module.exports.del = del;
