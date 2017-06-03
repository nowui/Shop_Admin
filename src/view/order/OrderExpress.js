import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Spin, Button, Input, Select, message} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';
import style from '../style.css';

class OrderExpress extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false,
      is_show: false,
      action: '',
      express_id: '',
      order_id: ''
    }
  }

  componentDidMount() {
    notification.on('notification_order_express_save', this, function (data) {
      this.setState({
        is_show: true,
        action: 'save',
        order_id: data.order_id
      });
    });

    notification.on('notification_order_express_update', this, function (data) {
      this.setState({
        is_show: true,
        action: 'update',
        express_id: data.express_id
      });

      this.handleLoad(data.express_id);
    });
  }

  componentWillUnmount() {
    notification.remove('notification_order_express_save', this);

    notification.remove('notification_order_express_update', this);
  }

  handleLoad(express_id) {
    this.setState({
      is_load: true
    });

    http.request({
      url: '/express/admin/find',
      data: {
        express_id: express_id
      },
      success: function (json) {
        this.props.form.setFieldsValue({
          express_type: json.data.express_type,
          express_number: json.data.express_number
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

      values.express_id = this.state.express_id;
      values.order_id = this.state.order_id;

      this.setState({
        is_load: true
      });

      http.request({
        url: '/express/admin/' + this.state.action,
        data: values,
        success: function (json) {
          message.success(constant.success);

          this.handleCancel();

          notification.emit('notification_order_detail_load', {});
        }.bind(this),
        complete: function () {
          this.setState({
            is_load: false
          });
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
    const Option = Select.Option;
    const {getFieldDecorator} = this.props.form;

    return (
      <Modal title={'快递表单'} maskClosable={false} width={constant.detail_width}
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
          <from>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="快递类型">
              {
                getFieldDecorator('express_type', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Select allowClear placeholder="请选择快递类型" className={style.formItemInput}>
                    {
                      constant.express_type.map(function (item) {
                        return (
                          <Option key={item.value} value={item.value}>{item.label}</Option>
                        )
                      })
                    }
                  </Select>
                )
              }
            </FormItem>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="快递单号">
              {
                getFieldDecorator('express_number', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '快递单号'}/>
                )
              }
            </FormItem>
          </from>
        </Spin>
      </Modal>
    );
  }
}

OrderExpress.propTypes = {};

OrderExpress = Form.create({})(OrderExpress);

export default connect(({}) => ({

}))(OrderExpress);
