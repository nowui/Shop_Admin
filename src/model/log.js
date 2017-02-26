import constant from '../constant/constant';

export default {

  namespace: 'log',

  state: {
    is_load: false,
    is_detail: false,
    action: '',
    log_id: '',
    log_name: '',
    list: [],
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