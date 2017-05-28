import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Spin, Button, Input, Table, Steps} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import request from '../../util/request';
import style from '../style.css';

class OrderDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false,
      is_show: false,
      product_list: []
    }
  }

  componentDidMount() {
    notification.on('notification_order_detail_update', this, function (data) {
      this.setState({
        is_show: true
      });

      this.handleLoad(data.order_id);
    });
  }

  componentWillUnmount() {
    notification.remove('notification_order_detail_update', this);
  }

  handleLoad(order_id) {
    this.setState({
      is_load: true
    });

    request.post({
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

        this.setState({
          product_list: json.data.product_list,
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
      is_show: false
    });

    this.props.form.resetFields();
  }

  render() {
    const FormItem = Form.Item;
    const {getFieldDecorator} = this.props.form;
    const Step = Steps.Step;

    const columns = [{
      width: 120,
      title: '商品名称',
      dataIndex: 'product_name'
    }, {
      width: 100,
      title: '价格',
      dataIndex: 'order_product_price'
    }, {
      width: 100,
      title: '数量',
      dataIndex: 'order_product_quantity'
    }, {
      width: 100,
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
      title: '佣金',
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
          {

          }
        </div>
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

          <Steps current={1} className={style.formStep}>
            <Step title="待付款" />
            <Step title="待发货" />
            <Step title="待收货" />
            <Step title="订单完成" />
            <Step title="订单取消" />
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

          <Table
            columns={columns}
            dataSource={this.state.product_list}
            pagination={false}
            rowKey={record => record.product_id}
            bordered
          />
          <br/>

        </Spin>
      </Modal>
    );
  }
}

OrderDetail.propTypes = {

};

OrderDetail = Form.create({})(OrderDetail);

export default connect(({order}) => ({
  order
}))(OrderDetail);
