import constant from '../constant/constant';

export default {

  namespace: 'member_level',

  state: {
    is_load: false,
    is_detail: false,
    action: '',
    member_level_id: '',
    member_level_name: '',
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