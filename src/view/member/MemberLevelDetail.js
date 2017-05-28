import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Spin, Button, Input, InputNumber, message} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import request from '../../util/request';
import style from '../style.css';

class MemberLevelDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false,
      is_show: false,
      action: '',
      member_level_id: ''
    }
  }

  componentDidMount() {
    notification.on('notification_member_level_detail_save', this, function (data) {
      this.setState({
        is_show: true,
        action: 'save'
      });
    });

    notification.on('notification_member_level_detail_update', this, function (data) {
      this.setState({
        is_show: true,
        action: 'update',
        member_level_id: data.member_level_id
      });

      this.handleLoad(data.member_level_id);
    });
  }

  componentWillUnmount() {
    notification.remove('notification_member_level_detail_save', this);

    notification.remove('notification_member_level_detail_update', this);
  }

  handleLoad(member_level_id) {
    this.setState({
      is_load: true
    });

    request.post({
      url: '/member/level/admin/find',
      data: {
        member_level_id: member_level_id
      },
      success: function (json) {
        this.props.form.setFieldsValue({
          member_level_name: json.data.member_level_name,
          member_level_value: json.data.member_level_value,
          member_level_sort: json.data.member_level_sort
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

      values.member_level_id = this.state.member_level_id;

      request.post({
        url: '/member/level/' + this.state.action,
        data: values,
        success: function (json) {
          message.success(constant.success);

          this.handleCancel();

          notification.emit('notification_member_level_index_load', {});
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
      <Modal title={'会员等级表单'} maskClosable={false} width={constant.detail_width}
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
                      style={{width: constant.detail_form_item_width}} label="会员等级排序">
              {
                getFieldDecorator('member_level_sort', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: 0
                })(
                  <InputNumber type="text" className={style.formItemInput} placeholder={constant.placeholder + '会员等级排序'}
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

MemberLevelDetail.propTypes = {};

MemberLevelDetail = Form.create({})(MemberLevelDetail);

export default connect(({member_level}) => ({
  member_level
}))(MemberLevelDetail);
