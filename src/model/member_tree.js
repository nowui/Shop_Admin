import constant from '../util/constant';

export default {

  namespace: 'member_tree',

  state: {
    is_load: false,
    is_detail: false,
    action: '',
    member_id: '',
    member_name: '',
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
