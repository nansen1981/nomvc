var log4      = require('./log4').log4;
function view(res,view){
	if(!view){
		view = res.controllerName + "/" + res.actionName;
	}
	res.render(view, res.viewBag);
}
function json(res,json){
	res.json(json);
}
function text(res,text){
	res.send(text.toString());
}
function error(res,err){
	res.viewBag.error = err;
	log4.error(err.stack);
	res.render("error/index", res.viewBag);
}
module.exports.view = view;
module.exports.json = json;
module.exports.text = text;
module.exports.error = error;