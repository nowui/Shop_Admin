import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Spin, Button, Input, Checkbox, message} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';
import style from '../style.css';

class AdminDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false,
      is_show: false,
      action: '',
      admin_id: '',
      isChange: false
    }
  }

  componentDidMount() {
    notification.on('notification_admin_detail_save', this, function (data) {
      this.setState({
        is_show: true,
        action: 'save'
      });
    });

    notification.on('notification_admin_detail_update', this, function (data) {
      this.setState({
        is_show: true,
        action: 'update',
        admin_id: data.admin_id
      });

      this.handleLoad(data.admin_id);
    });
  }

  componentWillUnmount() {
    notification.remove('notification_admin_detail_save', this);

    notification.remove('notification_admin_detail_update', this);
  }

  handleLoad(admin_id) {
    this.setState({
      is_load: true
    });

    http.request({
      url: '/admin/admin/find',
      data: {
        admin_id: admin_id
      },
      success: function (json) {
        this.props.form.setFieldsValue({
          admin_name: json.data.admin_name,
          user_account: json.data.user_account
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

      values.admin_id = this.state.admin_id;

      if (!this.state.isChange && this.state.action == 'update') {
        values.user_account = '';
      }

      this.setState({
        is_load: true
      });

      http.request({
        url: '/admin/' + this.state.action,
        data: values,
        success: function (json) {
          message.success(constant.success);

          this.handleCancel();

          notification.emit('notification_admin_index_load', {});
        }.bind(this),
        complete: function () {
          this.setState({
            is_load: false
          });
        }.bind(this)
      });
    });
  }

  handleChange(e) {
    this.setState({
      isChange: e.target.checked
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
      <Modal title={'管理员表单'} maskClosable={false} width={constant.detail_width}
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
          <Form>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="名称">
              {
                getFieldDecorator('admin_name', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '名称'}/>
                )
              }
            </FormItem>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="帐号">
              {
                getFieldDecorator('user_account', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '帐号'}/>
                )
              }
              {
                this.state.action == 'save' ?
                  ''
                  :
                  <Checkbox checked={this.state.isChange} onChange={this.handleChange.bind(this)}>是否修改帐号</Checkbox>
              }
            </FormItem>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="密码">
              {
                getFieldDecorator('user_password', {
                  rules: [{
                    required: this.state.action == 'save',
                    message: constant.required
                  }],
                  initialValue: '1'
                })(
                  <Input type="text" placeholder={constant.placeholder + '密码'}/>
                )
              }
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    );
  }
}

AdminDetail.propTypes = {};

AdminDetail = Form.create({})(AdminDetail);

export default connect(({admin}) => ({
  admin
}))(AdminDetail);
