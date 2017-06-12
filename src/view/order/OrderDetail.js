import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Spin, Button, Input, Table, Steps, Popconfirm, message} from 'antd';

import ExpressDetail from '../express/ExpressDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';
import style from '../style.css';

class OrderDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false,
      is_show: false,
      order_id: '',
      current: 0,
      order_flow: '',
      product_list: [],
      express_list: []
    }
  }

  componentDidMount() {
    notification.on('notification_order_detail_load', this, function (data) {
      if (this.state.order_flow == 'WAIT_SEND') {
        this.handleLoad(this.state.order_id);
      } else {
        this.handleExpressLoad();
      }
    });

    notification.on('notification_order_detail_update', this, function (data) {
      this.setState({
        is_show: true,
        order_id: data.order_id
      });

      this.handleLoad(data.order_id);
    });
  }

  componentWillUnmount() {
    notification.remove('notification_order_detail_load', this);

    notification.remove('notification_order_detail_update', this);
  }

  handleLoad(order_id) {
    this.setState({
      is_load: true
    });

    http.request({
      url: '/order/admin/find',
      data: {
        order_id: order_id
      },
      success: function (json) {
        this.props.form.setFieldsValue({
          order_number: json.data.order_number,
          order_delivery_name: json.data.order_delivery_name,
          order_delivery_phone: json.data.order_delivery_phone,
          order_delivery_address: json.data.order_delivery_address,
          order_message: json.data.order_message,
          order_amount: json.data.order_amount
        });

        for (var i = 0; i < json.data.product_list.length; i++) {
          json.data.product_list[i].order_product_commission = JSON.parse(json.data.product_list[i].order_product_commission);
        }

        var current = 0;
        if (json.data.order_flow == 'WAIT_PAY') {
          current = 0;
        } else if (json.data.order_flow == 'WAIT_SEND') {
          current = 1;
        } else if (json.data.order_flow == 'WAIT_RECEIVE') {
          current = 2;
        } else if (json.data.order_flow == 'FINISH') {
          current = 3;
        } else if (json.data.order_flow == 'CANCEL') {
          current = 4;
        }

        this.setState({
          current: current,
          order_flow: json.data.order_flow,
          product_list: json.data.product_list,
          express_list: json.data.express_list
        });
      }.bind(this),
      complete: function () {
        this.setState({
          is_load: false
        });

      }.bind(this)
    });
  }

  handleSubmit() {
    this.handleCancel();
  }

  handleCancel() {
    this.setState({
      is_load: false,
      is_show: false,
      current: 0,
      order_flow: '',
      product_list: [],
      express_list: []
    });

    this.props.form.resetFields();
  }

  handleExpressLoad() {
    this.setState({
      is_load: true
    });

    http.request({
      url: '/order/admin/express/list',
      data: {
        order_id: this.state.order_id
      },
      success: function (json) {
        this.setState({
          express_list: json.data
        });
      }.bind(this),
      complete: function () {
        this.setState({
          is_load: false
        });

      }.bind(this)
    });
  }

  handleExpressSave() {
    notification.emit('notification_express_detail_save', {
      order_id: this.state.order_id
    });
  }

  handleExpressUpdate(express_id) {
    notification.emit('notification_express_detail_update', {
      express_id: express_id
    });
  }

  handleExpressDelete(express_id) {
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

        this.handleExpressLoad();
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
    const Step = Steps.Step;

    const productColumns = [{
      width: 120,
      title: '商品名称',
      dataIndex: 'product_name'
    }, {
      width: 80,
      title: '价格',
      dataIndex: 'order_product_price'
    }, {
      width: 80,
      title: '数量',
      dataIndex: 'order_product_quantity'
    }, {
      width: 80,
      title: '合计',
      dataIndex: 'order_amount',
      render: (text, record, index) => (
        <div>
          {
            record.order_product_price * record.order_product_quantity
          }
        </div>
      )
    }, {
      title: '分成',
      dataIndex: 'order_product_commission',
      render: (text, record, index) => (
        <div>
          {
            record.order_product_commission.length == 0 ?
              ''
              :
              record.order_product_commission.map((item) => {
                return (
                  <div key={item.member_id}>
                    会员：{item.member_name}，
                    等级：{item.member_level_name}，
                    佣金：{item.product_commission}%，
                    分成：¥{item.commission_amount}
                  </div>
                );
              })
          }
        </div>
      )
    }];

    const expressColumns = [{
      width: 200,
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
      title: '流程',
      dataIndex: 'express_flow'
    }, {
      width: 120,
      title: constant.action,
      dataIndex: '',
      render: (text, record, index) => (
        <span>
          <a onClick={this.handleExpressUpdate.bind(this, record.express_id)}>{constant.find}</a>
          <span className={style.divider}/>
          <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                      cancelText={constant.popconfirm_cancel}
                      onConfirm={this.handleExpressDelete.bind(this, record.express_id)}>
            <a>{constant.delete}</a>
          </Popconfirm>
        </span>
      )
    }];

    return (
      <Modal title={'订单表单'} maskClosable={false} width={constant.detail_width}
             visible={this.state.is_show} onCancel={this.handleCancel.bind(this)}
             footer={[
               <Button key="back" type="ghost" size="default" icon="cross-circle"
                       onClick={this.handleCancel.bind(this)}>关闭</Button>,
               <Button key="submit" type="primary" size="default" icon="check-circle"
                       loading={this.state.is_load}
                       onClick={this.handleSubmit.bind(this)}>确定</Button>
             ]}
      >
        <Spin spinning={this.state.is_load}>

          <Steps current={this.state.current} className={style.formStep}>
            <Step title="待付款"/>
            <Step title="待发货"/>
            <Step title="待收货"/>
            <Step title="订单完成"/>
            <Step title="订单取消"/>
          </Steps>

          <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem + ' ' + style.marginTop}
                    style={{width: constant.detail_form_item_width}} label="订单号">
            {
              getFieldDecorator('order_number', {
                rules: [{
                  required: true,
                  message: constant.required
                }],
                initialValue: ''
              })(
                <Input type="text" placeholder={constant.placeholder + '订单号'}/>
              )
            }
          </FormItem>

          <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_width}} label="收货人">
            {
              getFieldDecorator('order_delivery_name', {
                rules: [{
                  required: true,
                  message: constant.required
                }],
                initialValue: ''
              })(
                <Input type="text" placeholder={constant.placeholder + '收货人'}/>
              )
            }
          </FormItem>

          <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_width}} label="手机号码">
            {
              getFieldDecorator('order_delivery_phone', {
                rules: [{
                  required: true,
                  message: constant.required
                }],
                initialValue: ''
              })(
                <Input type="text" placeholder={constant.placeholder + '手机号码'}/>
              )
            }
          </FormItem>

          <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_width}} label="收货地址">
            {
              getFieldDecorator('order_delivery_address', {
                rules: [{
                  required: true,
                  message: constant.required
                }],
                initialValue: ''
              })(
                <Input type="text" placeholder={constant.placeholder + '收货地址'}/>
              )
            }
          </FormItem>

          <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_width}} label="买家留言">
            {
              getFieldDecorator('order_message', {
                rules: [{
                  required: true,
                  message: constant.required
                }],
                initialValue: ''
              })(
                <Input type="text" placeholder={constant.placeholder + '买家留言'}/>
              )
            }
          </FormItem>

          <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_width}} label="订单金额">
            {
              getFieldDecorator('order_amount', {
                rules: [{
                  required: true,
                  message: constant.required
                }],
                initialValue: ''
              })(
                <Input type="text" placeholder={constant.placeholder + '订单金额'}/>
              )
            }
          </FormItem>

          <FormItem hasFeedback {...constant.formItemFullLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_full_width}} label="商品列表">
            <Table rowKey="product_id"
                   size="middle"
                   columns={productColumns}
                   dataSource={this.state.product_list}
                   pagination={false}
                   bordered
            />
          </FormItem>

          {
            this.state.order_flow == 'WAIT_PAY' ?
              ''
              :
              <FormItem hasFeedback {...constant.formItemFullLayoutDetail} className={style.formItem}
                        style={{width: constant.detail_form_item_full_width}} label="快递列表">
                <Table rowKey="express_id"
                       size="middle"
                       columns={expressColumns}
                       dataSource={this.state.express_list}
                       pagination={false}
                       bordered
                />
                {
                  this.state.order_flow == 'WAIT_SEND' || this.state.order_flow == 'WAIT_RECEIVE' ?
                    <Button key="submit" type="primary" size="default" icon="plus-circle" style={{marginTop: '5px'}}
                            loading={this.state.is_load}
                            onClick={this.handleExpressSave.bind(this)}>填写快递单号</Button>
                    :
                    ''
                }
              </FormItem>
          }


          <ExpressDetail notification="notification_order_detail_load"/>
        </Spin>
      </Modal>
    );
  }
}

OrderDetail.propTypes = {};

OrderDetail = Form.create({})(OrderDetail);

export default connect(({order}) => ({
  order
}))(OrderDetail);
