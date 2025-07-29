// File: utils/dbUtil.js
export const execQuery = function (ConPool, Qry, paramsOrCb, maybeCb) {
  // Determine if 3rd arg is params array or callback
  let params   = [];
  let callback = null;

  if (Array.isArray(paramsOrCb)) {
    params   = paramsOrCb;
    callback = maybeCb;
  } else {
    callback = paramsOrCb;
  }

  // If a callback is provided => callback style
  if (callback && typeof callback === "function") {
    ConPool.getConnection(function (err, connection) {
      if (err) {
        console.log("err_work_progress", err);
        callback(err, null);
        return;
      }

      connection.query(Qry, params, function (err, rows) {
        connection.release();
        if (err) {
          console.log("err_work_progress", err);
          callback(err, null);
          return;
        }
        callback(null, rows);
      });
    });

  } else {
    // No callback => return a Promise
    return new Promise(function (resolve, reject) {
      ConPool.getConnection(function (err, connection) {
        if (err) {
          console.log("err_work_progress", err);
          return reject(err);
        }

        connection.query(Qry, params, function (err, rows) {
          connection.release();
          if (err) {
            console.log("err_work_progress", err);
            return reject(err);
          }
          resolve(rows);
        });
      });
    });
  }
};
