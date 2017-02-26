import React, {Component, PropTypes} from 'react';
import {Modal, Form, Row, Col, Spin, Button, Input, Checkbox} from 'antd';

import constant from '../../constant/constant';
import style from '../style.css';

class AdminDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isChange: false
    }
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

      if (!this.state.isChange && this.props.action == 'update') {
        values.user_account = '';
      }

      this.props.handleSubmit(values);
    });
  }

  handleChange(e) {
    this.setState({
      isChange: e.target.checked
    });
  }

  handleCancel() {
    this.props.handleCancel();
  }

  handleReset() {
    this.props.form.resetFields();

    this.setState({
      isChange: false
    });
  }

  render() {
    const FormItem = Form.Item;
    const {getFieldDecorator} = this.props.form;

    return (
      <Modal title={'管理员表单'} maskClosable={false} width={constant.detail_width}
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
          {getFieldDecorator('user_id')(
            <Input type="hidden"/>
          )}
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
              this.props.action == 'save' ?
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
                  required: this.props.action == 'save',
                  message: constant.required
                }],
                initialValue: ''
              })(
                <Input type="text" placeholder={constant.placeholder + '密码'}/>
              )
            }
          </FormItem>
        </Spin>
      </Modal>
    );
  }
}

AdminDetail.propTypes = {
  is_load: React.PropTypes.bool.isRequired,
  is_detail: React.PropTypes.bool.isRequired,
  action: React.PropTypes.string.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
  handleCancel: React.PropTypes.func.isRequired
};

AdminDetail = Form.create({
  withRef: true
})(AdminDetail);

export default AdminDetail;
