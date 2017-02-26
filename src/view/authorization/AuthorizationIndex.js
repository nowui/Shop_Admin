import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Input, Table, Popconfirm, message} from 'antd';

import AuthorizationDetail from './AuthorizationDetail';
import constant from '../../constant/constant';
import http from '../../util/http';
import style from '../style.css';

let request;

class AuthorizationIndex extends Component {
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
    let authorization_token = this.props.form.getFieldValue('authorization_token');
    let page_index = 1;

    this.handleList(authorization_token, page_index);
  }

  handleLoad(page_index) {
    let authorization_token = this.props.authorization.authorization_token;

    this.handleList(authorization_token, page_index);
  }

  handleList(authorization_token, page_index) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request = http({
      url: '/authorization/admin/list',
      data: {
        authorization_token: authorization_token,
        page_index: page_index,
        page_size: this.props.authorization.page_size
      },
      success: function (json) {
        for (let i = 0; i < json.data.length; i++) {
          json.data[i].key = json.data[i].authorization_id;
        }

        this.props.dispatch({
          type: 'authorization/fetch',
          data: {
            authorization_token: authorization_token,
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
      type: 'authorization/fetch',
      data: {
        page_size: page_size
      }
    });

    setTimeout(function () {
      this.handleLoad(page_index);
    }.bind(this), constant.timeout);
  }

  handleSave() {
    this.props.dispatch({
      type: 'authorization/fetch',
      data: {
        is_detail: true,
        action: 'save'
      }
    });
  }

  handleUpdate(authorization_id) {
    if (this.handleStart({
        is_load: true,
        is_detail: true,
        action: 'update',
        authorization_id: authorization_id
      })) {
      return;
    }

    request = http({
      url: '/authorization/admin/find',
      data: {
        authorization_id: authorization_id
      },
      success: function (json) {
        this.refs.detail.setFieldsValue(json.data);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleDelete(authorization_id) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request = http({
      url: '/authorization/delete',
      data: {
        authorization_id: authorization_id
      },
      success: function (json) {
        message.success(constant.success);

        setTimeout(function () {
          this.handleLoad(this.props.authorization.page_index);
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

    if (this.props.authorization.action == 'update') {
      data.authorization_id = this.props.authorization.authorization_id;
    }

    request = http({
      url: '/authorization/' + this.props.authorization.action,
      data: data,
      success: function (json) {
        message.success(constant.success);

        this.handleCancel();

        setTimeout(function () {
          this.handleLoad(this.props.authorization.page_index);
        }.bind(this), constant.timeout);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleCancel() {
    this.props.dispatch({
      type: 'authorization/fetch',
      data: {
        is_detail: false
      }
    });

    this.refs.detail.refs.wrappedComponent.refs.formWrappedComponent.handleReset();
  }

  handleStart(data) {
    if (this.props.authorization.is_load) {
      return true;
    }

    this.props.dispatch({
      type: 'authorization/fetch',
      data: data
    });

    return false;
  }

  handleFinish() {
    this.props.dispatch({
      type: 'authorization/fetch',
      data: {
        is_load: false
      }
    });
  }

  handleReset() {
    request.cancel();

    this.props.dispatch({
      type: 'authorization/fetch',
      data: {
        is_detail: false
      }
    });
  }

  render() {
    const FormItem = Form.Item;
    const {getFieldDecorator} = this.props.form;

    const columns = [{
      title: 'Token',
      dataIndex: 'authorization_token',
      render: (text, record, index) => (
        <div>{record.authorization_token.substring(0, 30)}...</div>
      )
    }, {
      width: 100,
      title: '平台',
      dataIndex: 'authorization_platform'
    }, {
      width: 100,
      title: '版本',
      dataIndex: 'authorization_version'
    }, {
      width: 150,
      title: '创建时间',
      dataIndex: 'authorization_create_time'
    }, {
      width: 90,
      title: constant.action,
      dataIndex: '',
      render: (text, record, index) => (
        <span>
          <a onClick={this.handleUpdate.bind(this, record.authorization_id)}>{constant.update}</a>
          <span className={style.divider}/>
          <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                      cancelText={constant.popconfirm_cancel}
                      onConfirm={this.handleDelete.bind(this, record.authorization_id)}>
            <a>{constant.delete}</a>
          </Popconfirm>
        </span>
      )
    }];

    const pagination = {
      total: this.props.authorization.total,
      current: this.props.authorization.page_index,
      pageSize: this.props.authorization.page_size,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize.bind(this),
      onChange: this.handleLoad.bind(this)
    };

    return (
      <QueueAnim>
        <div key="0">
          <Row className={style.layoutContentHeader}>
            <Col span={8}>
              <h1>授权列表</h1>
            </Col>
            <Col span={16} className={style.layoutContentHeaderMenu}>
              <Button type="default" icon="search" size="default"
                      loading={this.props.authorization.is_load}
                      onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
            </Col>
          </Row>
          <Form className={style.layoutContentHeaderSearch}>
            <Row>
              <Col span={8}>
                <FormItem hasFeedback {...constant.formItemLayout} className={style.formItem} label="Token">
                  {
                    getFieldDecorator('authorization_token', {
                      initialValue: ''
                    })(
                      <Input type="text" placeholder="请输入token" className={style.formItemInput}/>
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
                 loading={this.props.authorization.is_load && !this.props.authorization.is_detail} columns={columns}
                 dataSource={this.props.authorization.list} pagination={pagination}
                 scroll={{y: constant.scrollHeight()}}
                 bordered/>
          <AuthorizationDetail is_load={this.props.authorization.is_load}
                               is_detail={this.props.authorization.is_detail}
                               handleSubmit={this.handleSubmit.bind(this)}
                               handleCancel={this.handleCancel.bind(this)}
                               ref="detail"/>
        </div>
      </QueueAnim>
    );
  }
}

AuthorizationIndex.propTypes = {};

AuthorizationIndex = Form.create({})(AuthorizationIndex);

export default connect(({authorization}) => ({
  authorization,
}))(AuthorizationIndex);
