import React, {Component, PropTypes} from 'react';
import {Modal, Form, Spin, Button, Input} from 'antd';

import constant from '../../constant/constant';
import style from '../style.css';

class DeliveryDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  handleSubmit() {
    this.props.form.validateFields((errors, values) => {
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
      <Modal title={'快递地址表单'} maskClosable={false} width={constant.detail_width}
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
                      style={{width: constant.detail_form_item_width}} label="收货人">
              {
                getFieldDecorator('delivery_name', {
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
                getFieldDecorator('delivery_phone', {
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
                      style={{width: constant.detail_form_item_width}} label="省份">
              {
                getFieldDecorator('delivery_province', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '省份'}/>
                )
              }
            </FormItem>

            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="城市">
              {
                getFieldDecorator('delivery_city', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '城市'}/>
                )
              }
            </FormItem>

            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="区域">
              {
                getFieldDecorator('delivery_area', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '区域'}/>
                )
              }
            </FormItem>

            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="街道">
              {
                getFieldDecorator('delivery_street', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '街道'}/>
                )
              }
            </FormItem>

            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="详细地址">
              {
                getFieldDecorator('delivery_address', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '详细地址'}/>
                )
              }
            </FormItem>

        </Spin>
      </Modal>
    );
  }
}

DeliveryDetail.propTypes = {
  is_load: React.PropTypes.bool.isRequired,
  is_detail: React.PropTypes.bool.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
  handleCancel: React.PropTypes.func.isRequired
};

DeliveryDetail = Form.create({
  withRef: true
})(DeliveryDetail);

export default DeliveryDetail;
