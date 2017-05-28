import constant from '../util/constant';

export default {

  namespace: 'member',

  state: {
    member_name: '',
    total: 0,
    page_index: 1,
    page_size: constant.page_size,
    list: [],
    member_level_list: []
  },

  reducers: {
    fetch(state, action) {
      return { ...state, ...action.data };
    }
  }

};
