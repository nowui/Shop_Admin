import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Input, Table, Popconfirm, message} from 'antd';

import OrderDetail from './OrderDetail';
import constant from '../../util/constant';
import http from '../../util/http';
import style from '../style.css';

let request;

class OrderVideoIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {
    this.props.form.setFieldsValue(this.props.order);

    this.handleSearch();
  }

  componentWillUnmount() {
    this.handleReset();
  }

  handleSearch() {
    let order_number = this.props.form.getFieldValue('order_number');
    let page_index = 1;

    this.handleList(order_number, page_index);
  }

  handleLoad(page_index) {
    let order_number = this.props.order.order_number;

    this.handleList(order_number, page_index);
  }

  handleList(order_number, page_index) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request = http({
      url: '/order/admin/video/list',
      data: {
        order_number: order_number,
        page_index: page_index,
        page_size: this.props.order.page_size
      },
      success: function (json) {
        for (let i = 0; i < json.data.length; i++) {
          json.data[i].key = json.data[i].order_id;
        }

        this.props.dispatch({
          type: 'order/fetch',
          data: {
            order_number: order_number,
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
      type: 'order/fetch',
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
      type: 'order/fetch',
      data: {
        is_detail: true,
        action: 'save'
      }
    });
  }

  handleUpdate(order_id) {
    if (this.handleStart({
        is_load: true,
        is_detail: true,
        action: 'update',
        order_id: order_id
      })) {
      return;
    }

    request = http({
      url: '/order/admin/find',
      data: {
        order_id: order_id
      },
      success: function (json) {
        this.refs.detail.refs.wrappedComponent.refs.formWrappedComponent.handleSetFieldsValue(json.data);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleDelete(order_id) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request = http({
      url: '/order/delete',
      data: {
        order_id: order_id
      },
      success: function (json) {
        message.success(constant.success);

        setTimeout(function () {
          this.handleLoad(this.props.order.page_index);
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

    if (this.props.order.action == 'update') {
      data.order_id = this.props.order.order_id;
    }

    request = http({
      url: '/order/' + this.props.order.action,
      data: data,
      success: function (json) {
        message.success(constant.success);

        this.handleCancel();

        setTimeout(function () {
          this.handleLoad(this.props.order.page_index);
        }.bind(this), constant.timeout);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleCancel() {
    this.props.dispatch({
      type: 'order/fetch',
      data: {
        is_detail: false
      }
    });

    this.refs.detail.refs.wrappedComponent.refs.formWrappedComponent.handleReset();
  }

  handleStart(data) {
    if (this.props.order.is_load) {
      return true;
    }

    this.props.dispatch({
      type: 'order/fetch',
      data: data
    });

    return false;
  }

  handleFinish() {
    this.props.dispatch({
      type: 'order/fetch',
      data: {
        is_load: false
      }
    });
  }

  handleReset() {
    request.cancel();

    this.props.dispatch({
      type: 'order/fetch',
      data: {
        is_detail: false
      }
    });
  }

  render() {
    const FormItem = Form.Item;
    const {getFieldDecorator} = this.props.form;

    const columns = [{
      width: 51,
      title: '头像',
      dataIndex: 'user_avatar',
      render: (text, record, index) => (
        <span style={{ position: 'relative' }}>
          <img style={{ position: 'absolute', top: 5, left: 5, width: '40px', height: '40px' }} src={record.user_avatar} />
        </span>
      )
    }, {
      title: '名称',
      dataIndex: 'user_name',
    }, {
      width: 82,
      title: '封面',
      dataIndex: 'product_image',
      render: (text, record, index) => (
        <span style={{ position: 'relative' }}>
          <img style={{ position: 'absolute', top: 5, left: 5, width: '71px', height: '40px' }} src={constant.host + record.product_image} />
        </span>
      )
    }, {
      width: 100,
      title: '视频',
      dataIndex: 'product_name'
    }, {
      width: 120,
      title: '订单号',
      dataIndex: 'order_number'
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
            text == 'WAIT_PAY' ?
              '待付款'
              :
              ''
          }
          {
            text == 'WAIT_SEND' ?
              '已完成'
              :
              ''
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
      total: this.props.order.total,
      current: this.props.order.page_index,
      pageSize: this.props.order.page_size,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize.bind(this),
      onChange: this.handleLoad.bind(this)
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
                      loading={this.props.order.is_load}
                      onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
            </Col>
          </Row>
          <Form className={style.layoutContentHeaderSearch}>
            <Row>
              <Col span={8}>
                <FormItem hasFeedback {...constant.formItemLayout} className={style.formItem} label="订单号">
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
          <Table className={style.layoutContentHeaderTable}
                 loading={this.props.order.is_load && !this.props.order.is_detail} columns={columns}
                 dataSource={this.props.order.list} pagination={pagination} scroll={{y: constant.scrollHeight()}}
                 bordered/>
          <OrderDetail is_load={this.props.order.is_load}
                       is_detail={this.props.order.is_detail}
                       handleSubmit={this.handleSubmit.bind(this)}
                       handleCancel={this.handleCancel.bind(this)}
                       ref="detail"/>
        </div>
      </QueueAnim>
    );
  }
}

OrderVideoIndex.propTypes = {};

OrderVideoIndex = Form.create({})(OrderVideoIndex);

export default connect(({order}) => ({
  order,
}))(OrderVideoIndex);
