var express = require('express');
var app = express();
var fs = require('fs'); // 此模板引擎依赖 fs 模块
var template = require("./lib/hView");
var config = require("./config");
app.engine('html', function (filePath, options, callback) { // 定义模板引擎
  fs.readFile(filePath, function (err, content) {
    if (err) return callback(new Error(err));
    // 这是一个功能极其简单的模板引擎
	var hView = new template.HView();
	hView.put("viewBag", options);
	//hView.debug(true);
	var rendered = hView.show(content.toString());
	rendered = rendered.replace(/\{ROOT\}/g,config.setting.root);
	rendered = rendered.replace(/\{HASH\}/g,"#");
    return callback(null, rendered);
  })
});
app.set('views', './views'); // 指定视图所在的位置
app.set('view engine', 'html'); // 注册模板引擎

var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['css','js','jpeg','jpg','gif','png'],
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now());
  }
}

var log = require('./lib/log4');  
log.use(app);  

app.use(express.static('static', options));

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//filter处理
app.use('/:controller?/:action?', function (req, res, next) {
	var controllerName = "main";
	var actionName = "index";
	if(req.params.controller){  
		controllerName =req.params.controller;  
	}  
	if(req.params.action){  
		actionName = req.params.action;  
	}
	var filter = require("./filter/filter.js");
	if(filter.execute(req,res,controllerName,actionName)){
		next();
	}else{
		res.status(500).send({ error: 'something blew up' });
	}
})
app.get('/:controller?/:action?', function (req, res) {
	route(req,res,req.params.controller,req.params.action);
})
app.post('/:controller?/:action?', function (req, res) {
	route(req,res,req.params.controller,req.params.action);
})
function route(req,res,controller,action){
	var controllerName = "main";
	var actionName = "index";
	if(controller){  
		controllerName = controller;  
	}  
	if(action){  
		actionName = action;  
	}
	var ctrl = require("./controller/" + controllerName);
	res.viewBag = {};
	res.viewBag.query = req.query;
	res.controllerName = controllerName;
	res.actionName = actionName;
	ctrl[actionName].call(this,req,res);
}
var server = app.listen(config.setting.listen, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("应用实例，访问地址为 http://%s:%s", host, port);
})