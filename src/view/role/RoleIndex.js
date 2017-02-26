import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Input, Table, Popconfirm, message} from 'antd';

import RoleDetail from './RoleDetail';
import constant from '../../constant/constant';
import http from '../../util/http';
import style from '../style.css';

let request;

class RoleIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {
    this.handleSearch();
  }

  componentWillUnmount() {
    this.handleReset();
  }

  handleSearch() {
    let role_name = this.props.form.getFieldValue('role_name');
    let page_index = 1;

    this.handList(role_name, page_index);
  }

  handLoad(page_index) {
    let role_name = this.props.role.role_name;

    this.handList(role_name, page_index);
  }

  handList(role_name, page_index) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request = http({
      url: '/role/admin/list',
      data: {
        role_name: role_name,
        page_index: page_index,
        page_size: this.props.role.page_size
      },
      success: function (json) {
        for (let i = 0; i < json.data.length; i++) {
          json.data[i].key = json.data[i].role_id;
        }

        this.props.dispatch({
          type: 'role/fetch',
          data: {
            role_name: role_name,
            total: json.total,
            list: json.data,
            page_index: page_index
          }
        });
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleChangeSize(page_index, page_size) {
    this.props.dispatch({
      type: 'role/fetch',
      data: {
        page_size: page_size
      }
    });

    setTimeout(function () {
      this.handLoad(page_index);
    }.bind(this), constant.timeout);
  }

  handSave() {
    this.props.dispatch({
      type: 'role/fetch',
      data: {
        is_detail: true,
        action: 'save'
      }
    });
  }

  handUpdate(role_id) {
    if (this.handleStart({
        is_load: true,
        is_detail: true,
        action: 'update',
        role_id: role_id
      })) {
      return;
    }

    request = http({
      url: '/role/admin/find',
      data: {
        role_id: role_id
      },
      success: function (json) {
        this.refs.detail.setFieldsValue(json.data);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleDelete(role_id) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request = http({
      url: '/role/delete',
      data: {
        role_id: role_id
      },
      success: function (json) {
        message.success(constant.success);

        setTimeout(function () {
          this.handLoad(this.props.role.page_index);
        }.bind(this), constant.timeout);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleSubmit(data) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    if (this.props.role.action == 'update') {
      data.role_id = this.props.role.role_id;
    }

    request = http({
      url: '/role/' + this.props.role.action,
      data: data,
      success: function (json) {
        message.success(constant.success);

        this.handleCancel();

        setTimeout(function () {
          this.handLoad(this.props.role.page_index);
        }.bind(this), constant.timeout);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleCancel() {
    this.props.dispatch({
      type: 'role/fetch',
      data: {
        is_detail: false
      }
    });

    this.refs.detail.resetFields();
  }

  handleStart(data) {
    if (this.props.role.is_load) {
      return true;
    }

    this.props.dispatch({
      type: 'role/fetch',
      data: data
    });

    return false;
  }

  handleFinish() {
    this.props.dispatch({
      type: 'role/fetch',
      data: {
        is_load: false
      }
    });
  }

  handleReset() {
    request.cancel();

    this.props.dispatch({
      type: 'role/fetch',
      data: {
        is_detail: false
      }
    });
  }

  render() {
    const FormItem = Form.Item;
    const {getFieldDecorator} = this.props.form;

    const columns = [{
      title: '名称',
      dataIndex: 'role_name'
    }, {
      width: 90,
      title: constant.action,
      dataIndex: '',
      render: (text, record, index) => (
        <span>
          <a onClick={this.handUpdate.bind(this, record.role_id)}>{constant.update}</a>
          <span className={style.divider}/>
          <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                      cancelText={constant.popconfirm_cancel} onConfirm={this.handleDelete.bind(this, record.role_id)}>
            <a>{constant.delete}</a>
          </Popconfirm>
        </span>
      )
    }];

    const pagination = {
      total: this.props.role.total,
      current: this.props.role.page_index,
      pageSize: this.props.role.page_size,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize.bind(this),
      onChange: this.handLoad.bind(this)
    };

    return (
      <QueueAnim>
        <div key="0">
          <Row className={style.layoutContentHeader}>
            <Col span={8}>
              <h1>角色列表</h1>
            </Col>
            <Col span={16} className={style.layoutContentHeaderMenu}>
              <Button type="default" icon="search" size="default" className={style.layoutContentHeaderMenuButton}
                      loading={this.props.role.is_load}
                      onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
              <Button type="primary" icon="plus-circle" size="default"
                      onClick={this.handSave.bind(this)}>{constant.save}</Button>
            </Col>
          </Row>
          <Form className={style.layoutContentHeaderSearch}>
            <Row>
              <Col span={8}>
                <FormItem hasFeedback {...constant.formItemLayout} className={style.formItem} label="名称">
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
              <Col span={8}>
              </Col>
            </Row>
          </Form>
          <Table className={style.layoutContentHeaderTable}
                 loading={this.props.role.is_load && !this.props.role.is_detail} columns={columns}
                 dataSource={this.props.role.list} pagination={pagination} scroll={{y: constant.scrollHeight()}}
                 bordered/>
          <RoleDetail is_load={this.props.role.is_load}
                      is_detail={this.props.role.is_detail}
                      handleSubmit={this.handleSubmit.bind(this)}
                      handleCancel={this.handleCancel.bind(this)}
                      ref="detail"/>
        </div>
      </QueueAnim>
    );
  }
}

RoleIndex.propTypes = {};

RoleIndex = Form.create({})(RoleIndex);

export default connect(({role}) => ({
  role,
}))(RoleIndex);
