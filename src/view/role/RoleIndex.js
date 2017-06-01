import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Input, Table, TreeSelect, Popconfirm, message} from 'antd';

import RoleDetail from './RoleDetail';
import RoleResource from './RoleResource';
import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';
import style from '../style.css';


class RoleIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false
    }
  }

  componentDidMount() {
    this.props.form.setFieldsValue({
      role_name: this.props.role.role_name
    });

    this.handleLoad();

    this.handleCategoryList();

    notification.on('notification_role_index_load', this, function (data) {
      this.handleLoad();
    });
  }

  componentWillUnmount() {
    notification.remove('notification_role_index_load', this);
  }

  handleSearch() {
    new Promise(function (resolve, reject) {
      this.props.dispatch({
        type: 'role/fetch',
        data: {
          role_name: this.props.form.getFieldValue('role_name'),
          page_index: 1
        }
      });

      resolve();
    }.bind(this)).then(function () {
      this.handleLoad();
    }.bind(this));
  }

  handleLoad() {
    this.setState({
      is_load: true
    });

    http.request({
      url: '/role/admin/list',
      data: {
        role_name: this.props.role.role_name,
        page_index: this.props.role.page_index,
        page_size: this.props.role.page_size
      },
      success: function (json) {
        this.props.dispatch({
          type: 'role/fetch',
          data: {
            total: json.total,
            list: json.data
          }
        });
      }.bind(this),
      complete: function () {
        this.setState({
          is_load: false
        });
      }.bind(this)
    });
  }

  handleCategoryList() {
    http.request({
      url: '/role/admin/category/list',
      data: {},
      success: function (json) {
        this.handleFormat(json.data);

        this.props.dispatch({
          type: 'role/fetch',
          data: {
            category_list: json.data
          }
        });
      }.bind(this),
      complete: function () {

      }.bind(this)
    });
  }

  handleFormat(children) {
    if (typeof (children) == 'undefined') {
      return;
    }

    for (var i = 0; i < children.length; i++) {
      children[i].key = children[i].category_id;
      children[i].value = children[i].category_id;
      children[i].label = children[i].category_name;

      this.handleFormat(children[i].children);
    }
  }

  handleChangeIndex(page_index) {
    new Promise(function (resolve, reject) {
      this.props.dispatch({
        type: 'role/fetch',
        data: {
          page_index: page_index
        }
      });

      resolve();
    }.bind(this)).then(function () {
      this.handleLoad();
    }.bind(this));
  }

  handleChangeSize(page_index, page_size) {
    new Promise(function (resolve, reject) {
      this.props.dispatch({
        type: 'role/fetch',
        data: {
          page_index: page_index,
          page_size: page_size
        }
      });

      resolve();
    }.bind(this)).then(function () {
      this.handleLoad();
    }.bind(this));
  }

  handleSave() {
    notification.emit('notification_role_detail_save', {});
  }

  handleUpdate(role_id) {
    notification.emit('notification_role_detail_update', {
      role_id: role_id
    });
  }

  handleResourceUpdate(role_id) {
    notification.emit('notification_role_resource_update', {
      role_id: role_id
    });
  }

  handleDelete(role_id) {
    this.setState({
      is_load: true
    });

    http.request({
      url: '/role/admin/delete',
      data: {
        role_id: role_id
      },
      success: function (json) {
        message.success(constant.success);

        this.handleLoad();
      }.bind(this),
      complete: function () {
        this.setState({
          is_load: false
        });
      }.bind(this)
    });
  }

  render() {
    const FormItem = Form.Item;
    const {getFieldDecorator} = this.props.form;

    const columns = [{
      width: 150,
      title: '分类',
      dataIndex: 'category_name'
    }, {
      title: '名称',
      dataIndex: 'role_name'
    }, {
      width: 150,
      title: '键值',
      dataIndex: 'role_key'
    }, {
      width: 135,
      title: constant.action,
      dataIndex: '',
      render: (text, record, index) => (
        <span>
          <a onClick={this.handleUpdate.bind(this, record.role_id)}>{constant.update}</a>
          <span className={style.divider}/>
          <a onClick={this.handleResourceUpdate.bind(this, record.role_id)}>权限</a>
          <span className={style.divider}/>
          <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                      cancelText={constant.popconfirm_cancel} onConfirm={this.handleDelete.bind(this, record.role_id)}>
            <a>{constant.delete}</a>
          </Popconfirm>
        </span>
      )
    }];

    const pagination = {
      size: 'defalut',
      total: this.props.role.total,
      showTotal: function (total, range) {
        return '总共' + total + '条数据';
      },
      current: this.props.role.page_index,
      pageSize: this.props.role.page_size,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize.bind(this),
      onChange: this.handleChangeIndex.bind(this)
    };

    return (
      <QueueAnim>
        <div key="0">
          <Row className={style.layoutContentHeader}>
            <Col span={8}>
              <div className={style.layoutContentHeaderTitle}>角色列表</div>
            </Col>
            <Col span={16} className={style.layoutContentHeaderMenu}>
              <Button type="default" icon="search" size="default" className={style.layoutContentHeaderMenuButton}
                      loading={this.state.is_load}
                      onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
              <Button type="primary" icon="plus-circle" size="default"
                      onClick={this.handleSave.bind(this)}>{constant.save}</Button>
            </Col>
          </Row>
          <Form className={style.layoutContentHeaderSearch}>
            <Row>
              <Col span={8}>
                <FormItem hasFeedback {...constant.formItemLayout} className={style.formSearchItem} label="所属分类">
                  {
                    getFieldDecorator('category_id', {
                      initialValue: ''
                    })(
                      <TreeSelect
                        placeholder="请选择所属分类"
                        allowClear
                        treeDefaultExpandAll
                        treeData={this.props.role.category_list}
                      />
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem hasFeedback {...constant.formItemLayout} className={style.formSearchItem} label="名称">
                  {
                    getFieldDecorator('role_name', {
                      initialValue: ''
                    })(
                      <Input type="text" placeholder="请输入名称" className={style.formItemInput}/>
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
              </Col>
            </Row>
          </Form>
          <Table rowKey="role_id"
                 className={style.layoutContentHeaderTable}
                 loading={this.state.is_load} columns={columns}
                 dataSource={this.props.role.list} pagination={pagination}
                 bordered/>
          <RoleDetail/>
          <RoleResource/>
        </div>
      </QueueAnim>
    );
  }
}

RoleIndex.propTypes = {};

RoleIndex = Form.create({})(RoleIndex);

export default connect(({role}) => ({
  role
}))(RoleIndex);
