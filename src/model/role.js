import constant from '../constant/constant';

export default {

  namespace: 'role',

  state: {
    is_load: false,
    is_detail: false,
    action: '',
    role_id: '',
    role_name: '',
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
