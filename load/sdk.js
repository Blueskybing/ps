/**
 * Created by root on 7/28/15.
 * 加载、注册方法
 */
var SDK = module.exports = {};
SDK.settings = {};

SDK.get = function (setting, def) {
    var ret = this.settings[setting];
    if (ret === undefined && def !== undefined) {
        ret = def;
        this.set(setting, ret);
    }
    return ret;
}
SDK.set = function (setting, def) {
    this.settings[setting] = def;
    return this.settings[setting];
}

SDK.loadConfig = function (key, file) {
    var env = this.get('env');
    var val;
    delete require.cache[require.resolve(file)]
    val = require(file);
    if (val[env]) {
        val = val[env];
    }
    this.set(key, val);
    return val;
}
var sdks = require("./loader").load("../ps/sdks/modules/", true);
SDK.set("sdks", sdks);
_Log.traceObj('load method...', sdks);

global.SDK = SDK;
