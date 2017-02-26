import constant from '../constant/constant';

export default {

  namespace: 'category',

  state: {
    is_load: false,
    is_detail: false,
    is_tree: false,
    action: '',
    category_id: '',
    parent_id: '',
    category_name: '',
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
