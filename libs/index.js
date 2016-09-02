
global.CONST_ENV = process.env.NODE_ENV || "development"; // 引用系统环境变量设置运行环境


require('./extension');
require('./config');
require('./log4js');
require('./db_pool');
//require('./redis');
require('./direct_solid');
require('./local_cache');
