import constant from '../util/constant';

export default {

  namespace: 'order',

  state: {
    order_number: '',
    order_flow: '',
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
