function HView(){
	this._data_ = {};
	this._view_ = "";
	this._debug_ = false;
	this._exec_ = function(){
		//模板输出结果
		var result = "";

		//公共的输出函数
		var echo = function (output) {
			result += output;
		}

		//记录解析错误
		var errors = global.AJ;
		global.AJ = errors = !errors ? [] : errors;

		//唯一分隔标志字符串
		var split = '_{' + Math.random() + '}_';
		//消除换行符
		//var estr = this._view_.replace(/\n|\r|\t/g, "");
		var estr = this._view_;
		var js = [];
		/****
		* 匹配标签<js> ...</js>--并且替换为特定的分隔串，
		* 并将匹配的js代码放入js数组中备用
		* */
		estr = estr.replace(/\#(.+?)\#|\#(.+?)[\r\n]|\#(.+?)$/g, function ($0, $1, $2, $3) {
			var jsCode = "";
			var result = split;
			if($1){
				jsCode = $1;
			}else if($2){
				jsCode = $2;
			}else{
				jsCode = $3;
			}
			jsCode = jsCode.replace(/\n|\r|\t/g, "");
			js.push(jsCode);
			return result;
		});
		/*根据特定的分隔串分隔得到普通txt文本串的数组*/
		var txt = estr.split(split);
		estr = "";
		/****
		* 0101010---0为txt[]元素,1为js[]元素
		* 重新串起来连接为可执行eval的estr
		* **/
		for (var i = 0; i < js.length; ++i) {
			estr += 'echo(txt[' + i + ']);';
			if(js[i] && js[i].substr(0,1)=='#'){
				estr += 'echo(' + js[i].substr(1) + ');'
			}else{
				estr += js[i];
			}
		}
		estr += 'echo(txt[' + js.length + ']);';
		try {
			if (this._data_) {
				for (var i in this._data_) {
					eval('var ' + i + ' =this._data_[i];');
				}
			}
			if(this._debug_){
				console.log(estr);
			}
			eval(estr);
		}
		catch (error) {
			console.log(error);
			errors.push([error, estr, template]);
		} finally {
			return result;
		}
	}
};
HView.prototype.put = function(name,value){
	this._data_[name] = value;
};
HView.prototype.debug = function(value){
	this._debug_ = value;
};
HView.prototype.show = function(view){
	this._view_ = view;
	return this._exec_();
};
HView.prototype.update = function(){
	return this._exec_();
};
module.exports.HView=HView;
