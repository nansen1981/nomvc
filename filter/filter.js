function execute(req,res,controller,action){
	var result = login(req,res,controller,action);
	result &= auth(req,res,controller,action);
	return result;
}
function login(req,res,controller,action){
	if(controller == "login"){
		return true;
	}
	if(req.cookies && req.cookies.userid && req.cookies.userid != ""){
		return true;
	}
	return true;
}
function auth(req,res,controller,action){
	return true;
}
module.exports.execute = execute;