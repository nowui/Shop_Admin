import constant from '../util/constant';

export default {

  namespace: 'supplier',

  state: {
    is_load: false,
    is_detail: false,
    action: '',
    supplier_id: '',
    supplier_name: '',
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