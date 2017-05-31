import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Spin, Button, Input, Checkbox, Select, message} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';
import style from '../style.css';

class MemberDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false,
      is_show: false,
      action: '',
      member_id: '',
      user_avatar: '',
      isChange: false
    }
  }

  componentDidMount() {
    notification.on('notification_member_detail_save', this, function (data) {
      this.setState({
        is_show: true,
        action: 'save'
      });
    });

    notification.on('notification_member_detail_update', this, function (data) {
      this.setState({
        is_show: true,
        action: 'update',
        member_id: data.member_id
      });

      this.handleLoad(data.member_id);
    });
  }

  componentWillUnmount() {
    notification.remove('notification_member_detail_save', this);

    notification.remove('notification_member_detail_update', this);
  }

  handleLoad(member_id) {
    this.setState({
      is_load: true
    });

    http.request({
      url: '/member/admin/find',
      data: {
        member_id: member_id
      },
      success: function (json) {
        this.props.form.setFieldsValue({
          member_level_id: json.data.member_level_id,
          member_name: json.data.member_name,
          user_phone: json.data.user_phone
        });

        this.setState({
          user_avatar: json.data.user_avatar,
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

      values.member_id = this.state.member_id;

      if (!this.state.isChange && this.state.action == 'update') {
        values.user_account = '';
      }

      this.setState({
        is_load: true
      });

      http.request({
        url: '/member/' + this.state.action,
        data: values,
        success: function (json) {
          message.success(constant.success);

          this.handleCancel();

          notification.emit('notification_member_index_load', {});
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
    const Option = Select.Option;
    const {getFieldDecorator} = this.props.form;

    return (
      <Modal title={'会员表单'} maskClosable={false} width={constant.detail_width}
             visible={this.state.is_show} onCancel={this.handleCancel.bind(this)}
             footer={[
               <Button key="back" type="ghost" size="default" icon="cross-circle"
                       onClick={this.handleCancel.bind(this)}>关闭</Button>,
               <Button key="submit" type="primary" size="default" icon="check-circle"
                       loading={this.state.is_load}
                       onClick={this.handleCancel.bind(this)}>确定</Button>
             ]}
      >
        <Spin spinning={this.state.is_load}>
          <form>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="会员等级">
              {
                getFieldDecorator('member_level_id', {
                  initialValue: ''
                })(
                  <Select style={{
                    width: '100%'
                  }} placeholder="请选择会员等级">
                    {
                      this.props.member.member_level_list.map(function (item) {
                        return (
                          <Option key={item.member_level_id}
                                  value={item.member_level_id}>{item.member_level_name}</Option>
                        )
                      })
                    }
                  </Select>
                )
              }
            </FormItem>

            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="会员名称">
              {
                getFieldDecorator('member_name', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '会员名称'}/>
                )
              }
            </FormItem>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="会员头像">
              {
                this.state.user_avatar == '' ?
                  ''
                  :
                  <img src={this.state.user_avatar} style={{
                    width: '120px'
                  }}/>
              }
            </FormItem>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="会员帐号">
              {
                getFieldDecorator('user_phone', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '会员帐号'}/>
                )
              }
              {
                this.props.action == 'save' ?
                  ''
                  :
                  <Checkbox checked={this.state.isChange} onChange={this.handleChange.bind(this)}>是否修改帐号</Checkbox>
              }
            </FormItem>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="会员密码">
              {
                getFieldDecorator('user_password', {
                  rules: [{
                    required: this.props.action == 'save',
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '会员密码'}/>
                )
              }
            </FormItem>
          </form>
        </Spin>
      </Modal>
    );
  }
}

MemberDetail.propTypes = {};

MemberDetail = Form.create({})(MemberDetail);

export default connect(({member}) => ({
  member
}))(MemberDetail);
