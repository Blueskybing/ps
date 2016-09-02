/**
 * Created by Bluesky on 2015/8/27.
 * Description：签名工具
 */

var sign = module.exports = {};
sign.getSign = function (obj, secret_key) {

    var obj_keys = Object.keys(obj).sort();
    var paras = [];
    for (var i in obj_keys) {
        var key = obj_keys[i];
        if (key == 'sign') {
            continue;
        }
        paras.push(key + "=" + encodeURIComponent(obj[key]));
    }
    paras.push("appsecret=" + secret_key);
    var sign_src = paras.join('&');
    var sign = _Utils.md5(sign_src);
    return {
        sign_src: sign_src,
        sign: sign
    }
}