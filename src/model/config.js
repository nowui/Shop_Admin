import constant from '../util/constant';

export default {

  namespace: 'config',

  state: {
    total: 0,
    page_index: 1,
    page_size: constant.page_size,
    list: [{
      key: '0',
      config_id: '0',
      config_name: '系统配置'
    }]
  },

  reducers: {
    fetch(state, action) {
      return { ...state, ...action.data };
    }
  }

};
