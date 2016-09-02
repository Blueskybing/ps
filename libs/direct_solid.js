function DirectSolid() {
    return function (sql, callBack, params) {
        var dbPool = _DBPool[params.dbPoolName];
        if (!dbPool) {
            _Log.error('连接池错误 dbPool:' + dbPool);
            callBack(null, params);
            return;
        }

        dbPool.getConnection(function (err, conn) {
            if (err) {
                _Log.fatalObj('getConnection error,sql:' + sql + ':', err);
                callBack(null, params);
                return;
            }
            conn.query(sql, params.columns || [], function (err, results) {
                conn.release();
                if (err) {
                    _Log.fatalObj('query error,sql:' + sql + ':', err);
                    callBack(null, params);
                    return;
                }
                callBack(results, params);
            });
        });
    }
}
global._DirectSolid = DirectSolid();
