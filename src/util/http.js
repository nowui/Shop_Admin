import reqwest from 'reqwest';
import {message} from 'antd';

import constant from './constant';
import storage from './storage';

function request(config) {
  reqwest({
    url: constant.host + config.url,
    type: 'json',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Token': storage.getToken(),
      'Platform': constant.platform,
      'Version': constant.version
    },
    data: JSON.stringify(config.data),
    success: function (response) {
      if (response.code == 200) {
        config.success(response);
      } else {
        message.error(response.message);
      }
    },
    error: function () {
      message.error(constant.error);
    },
    complete: function () {
      config.complete();
    }
  });
}

module.exports = {
  request: request
};
