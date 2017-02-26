import React, {Component, PropTypes} from 'react';
import {Modal, Form, Spin, Button, Input, Select} from 'antd';

import constant from '../../constant/constant';
import style from '../style.css';

class StudentDetail extends Component {
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
  }

  render() {
    const FormItem = Form.Item;
    const Option = Select.Option;
    const {getFieldDecorator} = this.props.form;

    return (
      <Modal title={'学生表单'} maskClosable={false} width={constant.detail_width}
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
                    style={{width: constant.detail_form_item_width}} label="班级编号">
            {
              getFieldDecorator('clazz_id', {
                rules: [{
                  required: true,
                  message: constant.required
                }],
                initialValue: ''
              })(
                <Select style={{
                  width: '100%'
                }} placeholder="请选择班级">
                  {
                    this.props.clazz.map(function (item) {
                      return (
                        <Option key={item.clazz_id} value={item.clazz_id}>{item.clazz_name}</Option>
                      )
                    })
                  }
                </Select>
              )
            }
          </FormItem>

          <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_width}} label="学生姓名">
            {
              getFieldDecorator('student_name', {
                rules: [{
                  required: true,
                  message: constant.required
                }],
                initialValue: ''
              })(
                <Input type="text" placeholder={constant.placeholder + '学生姓名'}/>
              )
            }
          </FormItem>

          <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_width}} label="学生学号">
            {
              getFieldDecorator('student_number', {
                rules: [{
                  required: true,
                  message: constant.required
                }],
                initialValue: ''
              })(
                <Input type="text" placeholder={constant.placeholder + '学生学号'}/>
              )
            }
          </FormItem>

          <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_width}} label="学生性别">
            {
              getFieldDecorator('student_sex', {
                rules: [{
                  required: true,
                  message: constant.required
                }],
                initialValue: ''
              })(
                <Select style={{
                  width: '100%'
                }} placeholder="请选择性别">
                  <Option key="man" value="男">男</Option>
                  <Option key="woman" value="女">女</Option>
                </Select>
              )
            }
          </FormItem>

          <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_width}} label="登录密码">
            {
              getFieldDecorator('user_password', {
                rules: [{
                  required: this.props.action == 'save',
                  message: constant.required
                }],
                initialValue: ''
              })(
                <Input type="text" placeholder={constant.placeholder + '登录密码'}/>
              )
            }
          </FormItem>

        </Spin>
      </Modal>
    );
  }
}

StudentDetail.propTypes = {
  is_load: React.PropTypes.bool.isRequired,
  is_detail: React.PropTypes.bool.isRequired,
  clazz: React.PropTypes.array.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
  handleCancel: React.PropTypes.func.isRequired
};

StudentDetail = Form.create({
  withRef: true
})(StudentDetail);

export default StudentDetail;
