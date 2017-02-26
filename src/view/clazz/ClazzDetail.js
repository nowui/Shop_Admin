import React, {Component, PropTypes} from 'react';
import {Modal, Form, Spin, Button, Input, InputNumber} from 'antd';

import constant from '../../constant/constant';
import style from '../style.css';

class ClazzDetail extends Component {
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
      <Modal title={'班级表单'} maskClosable={false} width={constant.detail_width}
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
                      style={{width: constant.detail_form_item_width}} label="班级名称">
              {
                getFieldDecorator('clazz_name', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '班级名称'}/>
                )
              }
            </FormItem>

            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="选课限制人数">
              {
                getFieldDecorator('clazz_course_apply_limit', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: 0
                })(
                  <InputNumber type="text" className={style.formItemInput} placeholder={constant.placeholder + '选课限制人数'}
                             min={0} max={999}/>
                )
              }
            </FormItem>

            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="选课开始时间">
              {
                getFieldDecorator('clazz_course_apply_start_time', {
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '选课开始时间'}/>
                )
              }
            </FormItem>

            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="选课结束时间">
              {
                getFieldDecorator('clazz_course_apply_end_time', {
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '选课结束时间'}/>
                )
              }
            </FormItem>

            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="班级排序">
              {
                getFieldDecorator('clazz_sort', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: 0
                })(
                  <InputNumber type="text" className={style.formItemInput} placeholder={constant.placeholder + '班级排序'}
                             min={0} max={999}/>
                )
              }
            </FormItem>

        </Spin>
      </Modal>
    );
  }
}

ClazzDetail.propTypes = {
  is_load: React.PropTypes.bool.isRequired,
  is_detail: React.PropTypes.bool.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
  handleCancel: React.PropTypes.func.isRequired
};

ClazzDetail = Form.create({
  withRef: true
})(ClazzDetail);

export default ClazzDetail;
