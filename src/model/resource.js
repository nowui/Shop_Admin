import constant from '../util/constant';

export default {

  namespace: 'resource',

  state: {
    category_id: '',
    resource_name: '',
    total: 0,
    page_index: 1,
    page_size: constant.page_size,
    list: [],
    category_list: []
  },

  reducers: {
    fetch(state, action) {
      return { ...state, ...action.data };
    }
  }

};
