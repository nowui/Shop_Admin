export default {
  formItemLayout: {
    labelCol: {span: 7},
    wrapperCol: {span: 17}
  },
  formItemLayoutDetail: {
    labelCol: {span: 6},
    wrapperCol: {span: 18}
  },
  formItemFullLayoutDetail: {
    labelCol: {span: 3},
    wrapperCol: {span: 21}
  },
  scrollHeight: function () {
    return document.documentElement.clientHeight - 340 - (document.documentElement.clientHeight - 340) % 51;
  },
  scrollHelpHeight: function () {
    return 519 - 120 - (519 - 120) % 51;
  },
  scrollModalHeight: function () {
    return 519 - 115 - (519 - 115) % 39;
  },
  timeout: 10,
  duration: 0.3,
  page_size: 10,
  action: '操作',
  search: '搜索',
  find: '查看',
  save: '新增',
  update: '修改',
  delete: '删除',
  load: '正在加载中..',
  success: '操作成功',
  error: '网络有问题',
  detail_width: 1000,
  detail_form_item_width: 480,
  detail_form_item_full_width: 960,
  popconfirm_title: '您确定要删除该数据吗?',
  popconfirm_ok: '确定',
  popconfirm_cancel: '取消',
  required: '不能为空',
  host: 'http://localhost:8080',
  // host: 'http://api.xietong.nowui.com',
  placeholder: '请输入',
  platform: 'Admin',
  version: '1.0.0'
};
