import constant from '../constant/constant';

export default {

  namespace: 'student',

  state: {
    is_load: false,
    is_detail: false,
    action: '',
    student_id: '',
    student_name: '',
    clazz_id: '',
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
