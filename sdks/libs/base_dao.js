/**
 * Created by Bluesky on 2015/8/27.
 * Description：数据库固定基本操作
 */
var base_dao = module.exports = {};

/**
 * 根据订单号更新CP回调状态1代表成功
 * @param order_id
 */
base_dao.updateOrderForCPCallbackStatus = function (order_id) {
    var sql = "update `umg_sdk_order` set `cp_callback_status` = 1 where `order_id` = ?";
    _DirectSolid(sql, function (results) {
        if (!results || results.affectedRows <= 0) {
            _Log.error('订单更新CP回调状态失败，sql语句：' + sql);
        }
    }, {dbPoolName: 'union_mobile_game', columns: [order_id]});
}
/**
 * 根据订单号更新渠道回调状态、实际金额、回调时间、渠道订单id，1代表成功
 * @param order_id
 */
base_dao.updateOrderForChannelCallback = function (params, callback) {
    var sql = "update `umg_sdk_order` set `channel_callback_status` = 1 ,`channel_order_id` = ? ,`real_fee` = ? ,`channel_callback_time` = ? where `order_id` = ?";
    _DirectSolid(sql, function (results) {
        if (!results || results.affectedRows <= 0) {
            _Log.error('订单更新渠道回调状态失败，sql语句：' + sql);
            callback(null);
        } else {
            callback(results);
        }
    }, {
        dbPoolName: 'union_mobile_game',
        columns: [params.channel_order_id || '', params.real_fee || 0, new Date(), params.order_id]
    });
}
/**
 * 根据订单ID查询订单信息
 * @param order_id
 * @param callback
 */
base_dao.getOrderInfoByOrderid = function (order_id, callback) {
    var sql = "select * from `umg_sdk_order` where `order_id` = ?";
    _DirectSolid(sql, function (results) {
        if (results || results.affectedRows > 0) {
            if (typeof callback == 'function') {
                callback(results[0]);
            } else {
                _Log.error('回调失败，请转入正确的回调函数.');
                callback(null);
            }
        } else {
            _Log.error('查询订单失败，sql语句：' + sql);
            callback(null);
        }
    }, {dbPoolName: 'union_mobile_game', columns: [order_id]});
}
/**
 *  新增订单
 * @param insert_obj
 * @param callback
 */
base_dao.addOderInfo = function (insert_obj, callback) {
    base_dao.addObj(insert_obj, callback, 'umg_sdk_order');
}

/**
 * 根据数据库表名新增对象
 * @param insert_obj
 * @param callback
 * @param table_name
 */
base_dao.addObj = function (insert_obj, callback, table_name) {
    if (!table_name) {
        _Log.error('table_name不能为空..');
        callback(null);
    } else if (typeof insert_obj == 'object') {
        var insert_sql = "insert into " + table_name + " SET  ?";
        _DirectSolid(insert_sql, function (results) {
            if (typeof callback == 'function') {
                callback(results);
            } else {
                callback(null);
                _Log.error('回调失败，请转入正确的回调函数.');
            }
        }, {
            dbPoolName: 'union_mobile_game',
            columns: insert_obj
        });
    } else {
        _Log.errorObj('请传入正确的对象', insert_obj);
        callback(null);
    }
}



