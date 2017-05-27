import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Input, Table, Popconfirm, message} from 'antd';

import OrderDetail from './OrderDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import request from '../../util/request';
import style from '../style.css';

class OrderIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false
    }
  }

  componentDidMount() {
    this.props.form.setFieldsValue({
      order_number: this.props.order.order_number
    });

    this.handleLoad();
  }

  componentWillUnmount() {

  }

  handleSearch() {
    new Promise(function(resolve, reject) {
      this.props.dispatch({
        type: 'order/fetch',
        data: {
          order_number: this.props.form.getFieldValue('order_number'),
          page_index: 1
        }
      });

      resolve();
    }.bind(this)).then(function() {
      this.handleLoad();
    }.bind(this));
  }

  handleLoad() {
    this.setState({
      is_load: true
    });

    request.post({
      url: '/order/admin/list',
      data: {
        order_number: this.props.order.order_number,
        page_index: this.props.order.page_index,
        page_size: this.props.order.page_size
      },
      success: function (json) {
        this.props.dispatch({
          type: 'order/fetch',
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
    new Promise(function(resolve, reject) {
      this.props.dispatch({
        type: 'order/fetch',
        data: {
          page_index: page_index
        }
      });

      resolve();
    }.bind(this)).then(function() {
      this.handleLoad();
    }.bind(this));
  }

  handleChangeSize(page_index, page_size) {
    new Promise(function(resolve, reject) {
      this.props.dispatch({
        type: 'order/fetch',
        data: {
          page_index: page_index,
          page_size: page_size
        }
      });

      resolve();
    }.bind(this)).then(function() {
      this.handleLoad();
    }.bind(this));
  }

  handleSave() {

  }

  handleUpdate(order_id) {
    notification.emit('notification_order_detail_update', {
      order_id: order_id
    });
  }

  handleDelete(order_id) {

  }

  render() {
    const FormItem = Form.Item;
    const {getFieldDecorator} = this.props.form;

    const columns = [{
      width: 120,
      title: '订单号',
      dataIndex: 'order_number'
    }, {
      title: '收货人',
      dataIndex: 'order_delivery_name'
    }, {
      width: 95,
      title: '电话',
      dataIndex: 'order_delivery_phone'
    }, {
      width: 80,
      title: '金额',
      dataIndex: 'order_product_amount'
    }, {
      width: 80,
      title: '状态',
      dataIndex: 'order_flow',
      render: (text, record, index) => (
        <span>
          {
            constant.getOrderFlow(text)
          }
        </span>
      )
    }, {
      width: 90,
      title: constant.action,
      dataIndex: '',
      render: (text, record, index) => (
        <span>
          <a onClick={this.handleUpdate.bind(this, record.order_id)}>{constant.find}</a>
        </span>
      )
    }];

    const pagination = {
      size: 'defalut',
      total: this.props.order.total,
      showTotal: function (total, range) {
        return '总共' + total + '条数据';
      },
      current: this.props.order.page_index,
      pageSize: this.props.order.page_size,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize.bind(this),
      onChange: this.handleChangeIndex.bind(this)
    };

    return (
      <QueueAnim>
        <div key="0">
          <Row className={style.layoutContentHeader}>
            <Col span={8}>
              <div className={style.layoutContentHeaderTitle}>订单列表</div>
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
                <FormItem hasFeedback {...constant.formItemLayout} className={style.formSearchItem} label="订单号">
                  {
                    getFieldDecorator('order_number', {
                      initialValue: ''
                    })(
                      <Input type="text" placeholder="请输入订单号" className={style.formItemInput}/>
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
          <Table rowKey="order_id"
                 className={style.layoutContentHeaderTable}
                 loading={this.state.is_load} columns={columns}
                 dataSource={this.props.order.list} pagination={pagination}
                 bordered/>
          <OrderDetail ref="detail"/>
        </div>
      </QueueAnim>
    );
  }
}

OrderIndex.propTypes = {};

OrderIndex = Form.create({})(OrderIndex);

export default connect(({order}) => ({
  order
}))(OrderIndex);
