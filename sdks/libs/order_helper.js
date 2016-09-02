/**
 * Created by Bluesky on 2015/8/26.
 * Description：订单 ID 生成
 */
"use strict";

var base_dao = require("./base_dao");
var notify = require("./notify");
var order_helper = module.exports = {};


/**
 * 支付回调更新订单、通知CP发货
 * @param params
 * @param callback
 */
order_helper.callbackUpdateOrderinfo = function (params, callback) {
    base_dao.getOrderInfoByOrderid(params.order_id, function (result) {
        if (result) {
            // 已发货，直接返回true
            if (result.cp_callback_status == 1) {
                _Log.info('此笔订单已发货。');
                callback(true);
            } else {
                if (params.real_fee) {
                    result.real_fee = params.real_fee;
                }
                base_dao.updateOrderForChannelCallback(params, function (result2) {
                    if (result2) {
                        _Log.info('支付回调更新订单状态成功...');
                        var app_info = _SystemParams.getAppInfo(params.appid);
                        _Log.traceObj('app_info:appid:' + params.appid, app_info);
                        if (app_info) {
                            notify.notifyCP(result, app_info);
                            callback(result2);
                        } else {
                            callback(null);
                            _Log.error('支付回调未获取到CP应用信息。')
                        }
                    } else {
                        callback(null);
                    }
                });
            }
        } else {
            callback(null);
        }
    });
}