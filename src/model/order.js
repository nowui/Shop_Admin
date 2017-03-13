import constant from '../util/constant';

export default {

  namespace: 'order',

  state: {
    is_load: false,
    is_detail: false,
    action: '',
    order_id: '',
    order_number: '',
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
