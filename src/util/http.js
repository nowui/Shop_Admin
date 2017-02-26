import fetch from 'dva/fetch';
import {message} from 'antd';

import constant from '../constant/constant';
import database from '../util/database';

const operation = (promise) => {
  let hasCanceled_ = false;
  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then((val) =>
      hasCanceled_ ? reject({isCanceled: true}) : resolve(val)
    );
    promise.catch((error) =>
      hasCanceled_ ? reject({isCanceled: true}) : reject(error)
    );
  });
  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    }
  };
};

export default function http(config) {
  const request = operation(fetch(constant.host + config.url, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Token': database.getToken(),
      'Platform': constant.platform,
      'Version': constant.version
    },
    method: 'POST',
    body: JSON.stringify(config.data)
  }));

  return {
    post() {
      request.promise.then(function (response) {
        if (response.status !== 200) {
          return;
        }
        response.json().then(function (json) {
          if (json.code == 200) {
            setTimeout(function () {
              config.success(json);
            }.bind(this), constant.timeout);
          } else if (json.code == 404) {
            message.error('找不到该接口');
          } else {
            message.error(json.message);
          }

          setTimeout(function () {
            config.complete();
          }.bind(this), constant.timeout);
        })
      }).catch(function (error) {
        message.error(constant.error);

        setTimeout(function () {
          config.complete();
        }.bind(this), constant.timeout);
      });

      return request;
    },
    cancel() {
      request.cancel();
    },
  };
}
