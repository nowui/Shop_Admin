import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Spin, Button, Input, message} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import request from '../../util/request';
import style from '../style.css';

class AuthorizationDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false,
      is_show: false,
      action: '',
      authorization_id: ''
    }
  }

  componentDidMount() {
    notification.on('notification_authorization_detail_save', this, function (data) {
      this.setState({
        is_show: true,
        action: 'save'
      });
    });

    notification.on('notification_authorization_detail_update', this, function (data) {
      this.setState({
        is_show: true,
        action: 'update',
        authorization_id: data.authorization_id
      });

      this.handleLoad(data.authorization_id);
    });
  }

  componentWillUnmount() {
    notification.remove('notification_authorization_detail_save', this);

    notification.remove('notification_authorization_detail_update', this);
  }

  handleLoad(authorization_id) {
    this.setState({
      is_load: true
    });

    request.post({
      url: '/authorization/admin/find',
      data: {
        authorization_id: authorization_id
      },
      success: function (json) {
        this.props.form.setFieldsValue({
          authorization_token: json.data.authorization_token,
          authorization_platform: json.data.authorization_platform,
          authorization_version: json.data.authorization_version,
          authorization_ip_address: json.data.authorization_ip_address,
          authorization_create_time: json.data.authorization_create_time,
          authorization_expire_time: json.data.authorization_expire_time
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

    return (
      <Modal title={'授权表单'} maskClosable={false} width={constant.detail_width}
             visible={this.state.is_show} onCancel={this.handleCancel.bind(this)}
             footer={[
               <Button key="back" type="ghost" size="default" icon="cross-circle"
                       onClick={this.handleCancel.bind(this)}>关闭</Button>,
               <Button key="submit" type="primary" size="default" icon="check-circle"
                       loading={this.props.is_load}
                       onClick={this.handleSubmit.bind(this)}>确定</Button>
             ]}
      >
        <Spin spinning={this.state.is_load}>
          <form>
            <FormItem {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="授权Token">
              {
                getFieldDecorator('authorization_token', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="textarea" placeholder={constant.placeholder + '授权Token'} rows={8}/>
                )
              }
            </FormItem>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="平台">
              {
                getFieldDecorator('authorization_platform', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '平台'}/>
                )
              }
            </FormItem>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="版本">
              {
                getFieldDecorator('authorization_version', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '版本'}/>
                )
              }
            </FormItem>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="IP地址">
              {
                getFieldDecorator('authorization_ip_address', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + 'IP地址'}/>
                )
              }
            </FormItem>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="创建时间">
              {
                getFieldDecorator('authorization_create_time', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '创建时间'}/>
                )
              }
            </FormItem>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="失效时间">
              {
                getFieldDecorator('authorization_expire_time', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '失效时间'}/>
                )
              }
            </FormItem>
          </form>
        </Spin>
      </Modal>
    );
  }
}

AuthorizationDetail.propTypes = {};

AuthorizationDetail = Form.create({})(AuthorizationDetail);

export default connect(({authorization}) => ({
  authorization
}))(AuthorizationDetail);
