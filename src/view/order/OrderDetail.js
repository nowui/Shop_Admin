import React, {Component, PropTypes} from 'react';
import {Modal, Form, Spin, Button, Input, InputNumber} from 'antd';

import constant from '../../util/constant';
import style from '../style.css';

class OrderDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  handleSubmit() {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return;
      }

      this.props.handleSubmit(values);
    });
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
                      style={{width: constant.detail_form_item_width}} label="用户编号">
              {
                getFieldDecorator('user_id', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '用户编号'}/>
                )
              }
            </FormItem>

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
                      style={{width: constant.detail_form_item_width}} label="商品数量">
              {
                getFieldDecorator('order_product_number', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: 0
                })(
                  <InputNumber type="text" className={style.formItemInput} placeholder={constant.placeholder + '商品数量'}
                             min={0} max={999}/>
                )
              }
            </FormItem>

            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="应付金额">
              {
                getFieldDecorator('order_receivable_amount', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '应付金额'}/>
                )
              }
            </FormItem>

            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="实付金额">
              {
                getFieldDecorator('order_receive_amount', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '实付金额'}/>
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
                      style={{width: constant.detail_form_item_width}} label="支付帐号">
              {
                getFieldDecorator('order_pay_account', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '支付帐号'}/>
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
                      style={{width: constant.detail_form_item_width}} label="支付结果">
              {
                getFieldDecorator('order_pay_result', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '支付结果'}/>
                )
              }
            </FormItem>

            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="会员等级编号">
              {
                getFieldDecorator('member_level_id', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '会员等级编号'}/>
                )
              }
            </FormItem>

            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="会员等级名称">
              {
                getFieldDecorator('member_level_name', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '会员等级名称'}/>
                )
              }
            </FormItem>

            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="会员等级数值">
              {
                getFieldDecorator('member_level_value', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: 0
                })(
                  <InputNumber type="text" className={style.formItemInput} placeholder={constant.placeholder + '会员等级数值'}
                             min={0} max={999}/>
                )
              }
            </FormItem>

            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="订单状态">
              {
                getFieldDecorator('order_status', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '订单状态'}/>
                )
              }
            </FormItem>

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
