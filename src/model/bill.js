import constant from '../util/constant';

export default {

  namespace: 'bill',

  state: {
    is_load: false,
    is_detail: false,
    action: '',
    bill_id: '',
    bill_name: '',
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