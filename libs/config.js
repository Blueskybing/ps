var fs = require('fs');
global.CONFIG_MYSQL = {};

var config = JSON.parse(fs.readFileSync(__dirname + '/../config/config.json'));
(function () {
    var mysqlConfig = config['mysql'];
    for (var key in mysqlConfig) {
        CONFIG_MYSQL[key] = mysqlConfig[key][CONST_ENV];
    }
})();

global.CONFIG_LOG4JS = config['log4js'][CONST_ENV];
global.CONFIG_REDIS = config['redis'][CONST_ENV];


