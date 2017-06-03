import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Spin, Button, Input, Select, message} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';
import style from '../style.css';

class ExpressDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false,
      is_show: false,
      action: '',
      express_id: ''
    }
  }

  componentDidMount() {
    notification.on('notification_express_detail_save', this, function (data) {
      this.setState({
        is_show: true,
        action: 'save'
      });
    });

    notification.on('notification_express_detail_update', this, function (data) {
      this.setState({
        is_show: true,
        action: 'update',
        express_id: data.express_id
      });

      this.handleLoad(data.express_id);
    });
  }

  componentWillUnmount() {
    notification.remove('notification_express_detail_save', this);

    notification.remove('notification_express_detail_update', this);
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
          category_id: json.data.category_id,
          express_name: json.data.express_name
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
                      style={{width: constant.detail_form_item_width}} label="订单编号">
              {
                getFieldDecorator('order_id', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '订单编号'}/>
                )
              }
            </FormItem>
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
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="快递结果">
              {
                getFieldDecorator('express_result', {
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '快递结果'}/>
                )
              }
            </FormItem>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="快递流程">
              {
                getFieldDecorator('express_flow', {
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '快递流程'}/>
                )
              }
            </FormItem>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="快递状态">
              {
                getFieldDecorator('express_status', {
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '快递状态'}/>
                )
              }
            </FormItem>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="快递跟踪">
              {
                getFieldDecorator('express_trace', {
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '快递跟踪'}/>
                )
              }
            </FormItem>
          </from>
        </Spin>
      </Modal>
    );
  }
}

ExpressDetail.propTypes = {};

ExpressDetail = Form.create({})(ExpressDetail);

export default connect(({express}) => ({
  express
}))(ExpressDetail);
