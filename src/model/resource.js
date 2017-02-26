import constant from '../constant/constant';

export default {

  namespace: 'resource',

  state: {
    is_load: false,
    is_detail: false,
    action: '',
    resource_id: '',
    resource_name: '',
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