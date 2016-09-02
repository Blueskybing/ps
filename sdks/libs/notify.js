/**
 * Created by Bluesky on 2015/8/27.
 * Description：通知CP
 */
"use strict";
var sign = require("./sign");
var base_dao = require("./base_dao");
var notify = module.exports = {};

notify.notifyCP = function (order_info, app_info) {
    if (!order_info) {
        return;
    } else if (!app_info) {
        return;
    }
    var callback_url = app_info.notify_url;
    // 整理通知CP的参数
    var req_obj = {
        return_code: 'SUCCESS',
        order_id: order_info.order_id,
        cp_order_id: order_info.cp_order_id,
        appid: order_info.appid,
        uid: order_info.uid,
        real_fee: order_info.real_fee,
        trade_name: order_info.trade_name,
        product_count: order_info.product_count || '',
        attach: order_info.attach,
        pay_time: new Date().getTime()
    }
    var sign_obj = sign.getSign(req_obj, app_info.app_secret);
    req_obj.sign = sign_obj.sign;
    _Log.traceObj('通知CP支付结果-签名：', sign_obj);
    callback_url += '?' + _Utils.stringifyQueryString(req_obj);
    _Log.trace('通知CP支付结果-URL：' + callback_url);

    _Request.request(callback_url, function (err, data) {
        if (!err && data && (data.toUpperCase() == 'SUCCESS'
            || data.toUpperCase().indexOf('SUCCESS') >= 0)) {
            _Log.info('通知CP发货成功...');
            base_dao.updateOrderForCPCallbackStatus(order_info.order_id);
        } else {
            // 如果回调 CP 没有成功则在不同时间里重复回调3次
            // 需要通知的次数和时间
            var timer = {
                60000: 600000,      // 10分钟
                600000: 1800000     // 30分钟
            }
            var timeout_ms = 60000; // 1分钟
            if (order_info.timeout_ms) {
                if (timer[order_info.timeout_ms]) {
                    timeout_ms = timer[order_info.timeout_ms];
                    order_info.timeout_ms = timeout_ms;
                } else {
                    // 3次已过回调结束
                    _Log.trace('3次已过回调结束');
                    return;
                }
            } else {
                order_info.timeout_ms = timeout_ms;
            }
            setTimeout(function () {
                notify.notifyCP(order_info, app_info);
            }, timeout_ms);

            _Log.trace('回调CP发货失败了，下次发货回调CP时间：' + timeout_ms / 1000 / 60 + '（单位分钟）');
            if (err) {
                _Log.errorObj('通知CP服务器发送错误：', err);
            }
            _Log.error('CP回调地址：' + callback_url + ',data:' + data);
            _Log.errorObj('CP回调地址：' + callback_url + ',order_info:', order_info);
        }
    });
}

