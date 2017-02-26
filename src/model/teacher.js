import constant from '../constant/constant';

export default {

  namespace: 'teacher',

  state: {
    is_load: false,
    is_detail: false,
    action: '',
    teacher_id: '',
    teacher_name: '',
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