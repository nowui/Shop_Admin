import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Spin, Button, Input, InputNumber, message} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import request from '../../util/request';
import style from '../style.css';

class CartDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false,
      is_show: false,
      action: '',
      cart_id: ''
    }
  }

  componentDidMount() {
    notification.on('notification_cart_detail_save', this, function (data) {
      this.setState({
        is_show: true,
        action: 'save'
      });
    });

    notification.on('notification_cart_detail_update', this, function (data) {
      this.setState({
        is_show: true,
        action: 'update',
        cart_id: data.cart_id
      });

      this.handleLoad(data.cart_id);
    });
  }

  componentWillUnmount() {
    notification.remove('notification_cart_detail_save', this);

    notification.remove('notification_cart_detail_update', this);
  }

  handleLoad(cart_id) {
    this.setState({
      is_load: true
    });

    request.post({
      url: '/cart/admin/find',
      data: {
        cart_id: cart_id
      },
      success: function (json) {
        this.props.form.setFieldsValue({
          category_id: json.data.category_id,
          cart_name: json.data.cart_name
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
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return;
      }

      values.cart_id = this.state.cart_id;

      request.post({
        url: '/cart/' + this.state.action,
        data: values,
        success: function (json) {
          message.success(constant.success);

          this.handleCancel();

          notification.emit('notification_cart_index_load', {});
        }.bind(this),
        complete: function () {

        }.bind(this)
      });
    });
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

    return (
      <Modal title={'表单'} maskClosable={false} width={constant.detail_width}
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
          <form>
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
                      style={{width: constant.detail_form_item_width}} label="SKU编号">
              {
                getFieldDecorator('sku_id', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + 'SKU编号'}/>
                )
              }
            </FormItem>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="购物车商品数量">
              {
                getFieldDecorator('cart_product_quantity', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: 0
                })(
                  <InputNumber type="text" className={style.formItemInput}
                               placeholder={constant.placeholder + '购物车商品数量'}
                               min={0} max={999}/>
                )
              }
            </FormItem>
          </form>
        </Spin>
      </Modal>
    );
  }
}

CartDetail.propTypes = {};

CartDetail = Form.create({})(CartDetail);

export default connect(({cart}) => ({
  cart
}))(CartDetail);
