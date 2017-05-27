import reqwest from 'reqwest';
import {message} from 'antd';

import constant from './constant';
import database from '../util/database';

function post(config) {
  reqwest({
    url: constant.host + config.url,
    type: 'json',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Token': database.getToken(),
      'Platform': constant.platform,
      'Version': constant.version
    },
    data: JSON.stringify(config.data),
    success: function (response) {
      if (response.code == 200) {
        config.success(response);
      } else {
        message.error(response.message, constant.timeout);
      }
    },
    error: function () {
      message.error(constant.error, constant.timeout);
    },
    complete: function () {
      config.complete();
    }
  });
}

module.exports = {
  post: post
};
