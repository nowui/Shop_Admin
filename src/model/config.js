import constant from '../constant/constant';

export default {

  namespace: 'config',

  state: {
    is_load: false,
    is_detail: false,
    action: '',
    config_id: '',
    config_name: '',
    list: [{
      key: '0',
      config_id: '0',
      config_name: '系统配置'
    }],
    total: 0,
    page_index: 1,
    page_size: constant.page_size
  },

  reducers: {
    fetch(state, action) {
      return { ...state, ...action.data };
    }
  }

};
