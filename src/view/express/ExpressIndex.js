import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Input, Table, message} from 'antd';

import ExpressDetail from './ExpressDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';
import style from '../style.css';


class ExpressIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false
    }
  }

  componentDidMount() {
    this.props.form.setFieldsValue({
      express_number: this.props.express.express_number
    });

    this.handleLoad();

    notification.on('notification_express_index_load', this, function (data) {
      this.handleLoad();
    });
  }

  componentWillUnmount() {
    notification.remove('notification_express_index_load', this);
  }

  handleSearch() {
    new Promise(function (resolve, reject) {
      this.props.dispatch({
        type: 'express/fetch',
        data: {
          express_number: this.props.form.getFieldValue('express_number'),
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
      url: '/express/admin/list',
      data: {
        express_number: this.props.express.express_number,
        page_index: this.props.express.page_index,
        page_size: this.props.express.page_size
      },
      success: function (json) {
        this.props.dispatch({
          type: 'express/fetch',
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
        type: 'express/fetch',
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
        type: 'express/fetch',
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
    notification.emit('notification_express_detail_save', {});
  }

  handleUpdate(express_id) {
    notification.emit('notification_express_detail_update', {
      express_id: express_id
    });
  }

  handleDelete(express_id) {
    this.setState({
      is_load: true
    });

    http.request({
      url: '/express/admin/delete',
      data: {
        express_id: express_id
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
      title: '单号',
      dataIndex: 'express_number'
    }, {
      width: 80,
      title: '类型',
      dataIndex: 'express_type'
    }, {
      width: 80,
      title: '状态',
      dataIndex: 'express_status'
    }, {
      width: 80,
      title: '流程',
      dataIndex: 'express_flow'
    }, {
      width: 90,
      title: constant.action,
      dataIndex: '',
      render: (text, record, index) => (
        <span>
          <a onClick={this.handleUpdate.bind(this, record.express_id)}>{constant.find}</a>
        </span>
      )
    }];

    const pagination = {
      total: this.props.express.total,
      current: this.props.express.page_index,
      pageSize: this.props.express.page_size,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize.bind(this),
      onChange: this.handleChangeIndex.bind(this)
    };

    return (
      <QueueAnim>
        <div key="0">
          <Row className={style.layoutContentHeader}>
            <Col span={8}>
              <div className={style.layoutContentHeaderTitle}>快递单列表</div>
            </Col>
            <Col span={16} className={style.layoutContentHeaderMenu}>
              <Button type="primary" icon="search" size="default"
                      loading={this.state.is_load}
                      onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
            </Col>
          </Row>
          <Form className={style.layoutContentHeaderSearch}>
            <Row>
              <Col span={8}>
                <FormItem hasFeedback {...constant.formItemLayout} className={style.formSearchItem} label="单号">
                  {
                    getFieldDecorator('express_number', {
                      initialValue: ''
                    })(
                      <Input type="text" placeholder="请输入单号" className={style.formItemInput}/>
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
          <Table rowKey="express_id"
            className={style.layoutContentHeaderTable}
                 loading={this.state.is_load} columns={columns}
                 dataSource={this.props.express.list} pagination={pagination}
                 bordered/>
          <ExpressDetail notification="notification_express_index_load"/>
        </div>
      </QueueAnim>
    );
  }
}

ExpressIndex.propTypes = {};

ExpressIndex = Form.create({})(ExpressIndex);

export default connect(({express}) => ({
  express
}))(ExpressIndex);
