import React, {Component, PropTypes} from 'react';
import {Modal, Form, Spin, Button, Input, Table} from 'antd';

import constant from '../../util/constant';
import style from '../style.css';

class OrderDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      product_list: []
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  handleSetFieldsValue(values) {
    this.props.form.setFieldsValue(values);

    for (let i = 0; i < values.product_list.length; i++) {
      values.product_list[i].order_product_commission = JSON.parse(values.product_list[i].order_product_commission);
    }

    this.setState({
      product_list: values.product_list,
    });
  }

  handleSubmit() {
    // this.props.form.validateFieldsAndScroll((errors, values) => {
    //   if (!!errors) {
    //     return;
    //   }
    //
    //   this.props.handleSubmit(values);
    // });

    this.handleCancel();
  }

  handleCancel() {
    this.props.handleCancel();
  }

  handleReset() {
    this.props.form.resetFields();
  }

  render() {
    const FormItem = Form.Item;
    const {getFieldDecorator} = this.props.form;

    const columns = [{
      width: 120,
      title: '商品名称',
      dataIndex: 'product_name'
    }, {
      width: 100,
      title: '价格',
      dataIndex: 'product_price'
    }, {
      width: 100,
      title: '数量',
      dataIndex: 'product_quantity'
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
             visible={this.props.is_detail} onCancel={this.handleCancel.bind(this)}
             footer={[
               <Button key="back" type="ghost" size="default" icon="cross-circle"
                       onClick={this.handleCancel.bind(this)}>关闭</Button>,
               <Button key="submit" type="primary" size="default" icon="check-circle"
                       loading={this.props.is_load}
                       onClick={this.handleSubmit.bind(this)}>确定</Button>
             ]}
      >
        <Spin spinning={this.props.is_load}>

          <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
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
                    style={{width: constant.detail_form_item_width}} label="收货人姓名">
            {
              getFieldDecorator('order_delivery_name', {
                rules: [{
                  required: true,
                  message: constant.required
                }],
                initialValue: ''
              })(
                <Input type="text" placeholder={constant.placeholder + '收货人姓名'}/>
              )
            }
          </FormItem>

          <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_width}} label="收货人电话">
            {
              getFieldDecorator('order_delivery_phone', {
                rules: [{
                  required: true,
                  message: constant.required
                }],
                initialValue: ''
              })(
                <Input type="text" placeholder={constant.placeholder + '收货人电话'}/>
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
                    style={{width: constant.detail_form_item_width}} label="商品金额">
            {
              getFieldDecorator('order_product_amount', {
                rules: [{
                  required: true,
                  message: constant.required
                }],
                initialValue: ''
              })(
                <Input type="text" placeholder={constant.placeholder + '商品金额'}/>
              )
            }
          </FormItem>

          <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_width}} label="运费金额">
            {
              getFieldDecorator('order_freight_amount', {
                rules: [{
                  required: true,
                  message: constant.required
                }],
                initialValue: ''
              })(
                <Input type="text" placeholder={constant.placeholder + '运费金额'}/>
              )
            }
          </FormItem>

          <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_width}} label="折扣金额">
            {
              getFieldDecorator('order_discount_amount', {
                rules: [{
                  required: true,
                  message: constant.required
                }],
                initialValue: ''
              })(
                <Input type="text" placeholder={constant.placeholder + '折扣金额'}/>
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
                <Input type="text" placeholder={constant.placeholder + '折扣金额'}/>
              )
            }
          </FormItem>

          <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_width}} label="是否支付">
            {
              getFieldDecorator('order_is_pay', {
                rules: [{
                  required: true,
                  message: constant.required
                }],
                initialValue: ''
              })(
                <Input type="text" placeholder={constant.placeholder + '是否支付'}/>
              )
            }
          </FormItem>

          <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_width}} label="支付类型">
            {
              getFieldDecorator('order_pay_type', {
                rules: [{
                  required: true,
                  message: constant.required
                }],
                initialValue: ''
              })(
                <Input type="text" placeholder={constant.placeholder + '支付类型'}/>
              )
            }
          </FormItem>

          <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_width}} label="支付号">
            {
              getFieldDecorator('order_pay_number', {
                rules: [{
                  required: true,
                  message: constant.required
                }],
                initialValue: ''
              })(
                <Input type="text" placeholder={constant.placeholder + '支付号'}/>
              )
            }
          </FormItem>

          <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_width}} label="支付时间">
            {
              getFieldDecorator('order_pay_time', {
                rules: [{
                  required: true,
                  message: constant.required
                }],
                initialValue: ''
              })(
                <Input type="text" placeholder={constant.placeholder + '支付时间'}/>
              )
            }
          </FormItem>

          <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_width}} label="订单流程">
            {
              getFieldDecorator('order_flow', {
                rules: [{
                  required: true,
                  message: constant.required
                }],
                initialValue: ''
              })(
                <Input type="text" placeholder={constant.placeholder + '订单流程'}/>
              )
            }
          </FormItem>

          <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_width}} label="下单人等级">
            {
              getFieldDecorator('member_level_name', {
                rules: [{
                  required: true,
                  message: constant.required
                }],
                initialValue: ''
              })(
                <Input type="text" placeholder={constant.placeholder + '下单人等级'}/>
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
  is_load: React.PropTypes.bool.isRequired,
  is_detail: React.PropTypes.bool.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
  handleCancel: React.PropTypes.func.isRequired
};

OrderDetail = Form.create({
  withRef: true
})(OrderDetail);

export default OrderDetail;
