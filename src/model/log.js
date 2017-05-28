import constant from '../util/constant';

export default {

  namespace: 'log',

  state: {
    log_url: '',
    log_code: '',
    log_platform: '',
    total: 0,
    page_index: 1,
    page_size: constant.page_size,
    list: []
  },

  reducers: {
    fetch(state, action) {
      return { ...state, ...action.data };
    }
  }

};
