var log4 = {};  
exports.log4 = log4;  
  
var log4js = require('log4js');  
var fs = require("fs");  
var path = require("path");  
  
// 加载配置文件 
var objConfig = JSON.parse(fs.readFileSync("log4js.json", "utf8"));
// 检查配置文件所需的目录是否存在，不存在时创建  
 
log4js.configure(objConfig);
  
var logDebug = log4js.getLogger('debug');  
var logInfo = log4js.getLogger('info');  
var logWarn = log4js.getLogger('warn');  
var logErr = log4js.getLogger('error');  
var logSql = log4js.getLogger('sql');  
var logRequest = log4js.getLogger('request');  
  
log4.debug = function(msg){  
    if(msg == null)  
        msg = "";  
    logDebug.debug(msg);  
};  
  
log4.info = function(msg){  
    if(msg == null)  
        msg = "";  
    logInfo.info(msg);  
};  
  
log4.warn = function(msg){  
    if(msg == null)  
        msg = "";  
    logWarn.warn(msg);  
};
  
log4.error = function(msg){  
    if(msg == null)  
        msg = "";  
    logErr.error(msg);  
};  

log4.sql = function(msg){  
    if(msg == null)  
        msg = "";  
    logSql.debug(msg);  
}; 

log4.request = function(msg){  
    if(msg == null)  
        msg = "";  
    logRequest.debug(msg);  
};
  