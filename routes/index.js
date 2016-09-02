/**
 * Created by Bluesky on 2015/8/25.
 */
"use strict";

var router = require('express').Router();

router.use(function (req, res, next) {
    // 参数整合，方便后面使用
    if (req.method.toUpperCase() == 'GET') {
        req.params_info = req.query;
    } else {
        req.params_info = req.body;
    }
    _Log.traceObj('==routes/index============' + req.method + '===============', req.params_info);
    next();
});

router.use('/1.0/pay/order', require('./pay'));

module.exports = router;