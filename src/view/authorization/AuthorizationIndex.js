import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Input, Table, Popconfirm, message} from 'antd';

import AuthorizationDetail from './AuthorizationDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import request from '../../util/request';
import style from '../style.css';


class AuthorizationIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false
    }
  }

  componentDidMount() {
    this.props.form.setFieldsValue({
      authorization_token: this.props.authorization.authorization_token
    });

    this.handleLoad();

    notification.on('notification_authorization_index_load', this, function (data) {
      this.handleLoad();
    });
  }

  componentWillUnmount() {
    notification.remove('notification_authorization_index_load', this);
  }

  handleSearch() {
    new Promise(function (resolve, reject) {
      this.props.dispatch({
        type: 'authorization/fetch',
        data: {
          authorization_token: this.props.form.getFieldValue('authorization_token'),
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

    request.post({
      url: '/authorization/admin/list',
      data: {
        authorization_token: this.props.authorization.authorization_token,
        page_index: this.props.authorization.page_index,
        page_size: this.props.authorization.page_size
      },
      success: function (json) {
        this.props.dispatch({
          type: 'authorization/fetch',
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

  handleChangeIndex(page_index) {
    new Promise(function (resolve, reject) {
      this.props.dispatch({
        type: 'authorization/fetch',
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
        type: 'authorization/fetch',
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
    notification.emit('notification_authorization_detail_save', {});
  }

  handleUpdate(authorization_id) {
    notification.emit('notification_authorization_detail_update', {
      authorization_id: authorization_id
    });
  }

  handleDelete(authorization_id) {
    this.setState({
      is_load: true
    });

    request.post({
      url: '/authorization/delete',
      data: {
        authorization_id: authorization_id
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
      title: 'Token',
      dataIndex: 'authorization_token',
      render: (text, record, index) => (
        <div>{record.authorization_token.substring(0, 50)}...</div>
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
          <a onClick={this.handleUpdate.bind(this, record.authorization_id)}>{constant.find}</a>
        </span>
      )
    }];

    const pagination = {
      size: 'defalut',
      total: this.props.authorization.total,
      showTotal: function (total, range) {
        return '总共' + total + '条数据';
      },
      current: this.props.authorization.page_index,
      pageSize: this.props.authorization.page_size,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize.bind(this),
      onChange: this.handleChangeIndex.bind(this)
    };

    return (
      <QueueAnim>
        <div key="0">
          <Row className={style.layoutContentHeader}>
            <Col span={8}>
              <div className={style.layoutContentHeaderTitle}>授权列表</div>
            </Col>
            <Col span={16} className={style.layoutContentHeaderMenu}>
              <Button type="default" icon="search" size="default"
                      loading={this.state.is_load}
                      onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
            </Col>
          </Row>
          <Form className={style.layoutContentHeaderSearch}>
            <Row>
              <Col span={8}>
                <FormItem hasFeedback {...constant.formItemLayout} className={style.formSearchItem} label="Token">
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
          <Table rowKey="authorization_id"
                 className={style.layoutContentHeaderTable}
                 loading={this.state.is_load} columns={columns}
                 dataSource={this.props.authorization.list} pagination={pagination}
                 bordered/>
          <AuthorizationDetail ref="detail"/>
        </div>
      </QueueAnim>
    );
  }
}

AuthorizationIndex.propTypes = {};

AuthorizationIndex = Form.create({})(AuthorizationIndex);

export default connect(({authorization}) => ({
  authorization
}))(AuthorizationIndex);
