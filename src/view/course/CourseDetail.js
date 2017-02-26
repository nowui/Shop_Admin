import React, {Component, PropTypes} from 'react';
import {Modal, Form, Spin, Button, Input, InputNumber, Select, Table, Popconfirm} from 'antd';
import InputImage from '../../component/InputImage'
import StudentHelp from '../student/StudentHelp'

import constant from '../../constant/constant';
import style from '../style.css';

class CourseDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  handleSetFieldsValue(values) {
    values.clazz_id = JSON.parse(values.clazz_id);
    values.course_time = values.course_time.toString();

    this.props.form.setFieldsValue(values);

    this.refs.course_image.handleSetList(JSON.parse(values.course_image));
  }

  handleSubmit() {
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }

      values.course_image = JSON.stringify(this.refs.course_image.handleGetList());

      this.props.handleSubmit(values);
    });
  }

  handleCancel() {
    this.props.handleCancel();
  }

  handleReset() {
    this.props.form.resetFields();

    this.refs.course_image.handleReset();
  }

  handleDelete(student_id) {

  }

  handleWhile() {
    this.refs.student_help.refs.wrappedComponent.refs.formWrappedComponent.handleOpen('white');
  }

  handleBlack() {
    this.refs.student_help.refs.wrappedComponent.refs.formWrappedComponent.handleOpen('black');
  }

  handleSubmitReturn(student_id, type) {
    if (type == 'white') {
      this.props.handleWhiteSave(student_id);
    } else if (type == 'black') {
      this.props.handleBlackSave(student_id);
    }
  }

  render() {
    const FormItem = Form.Item;
    const Option = Select.Option;
    const {getFieldDecorator} = this.props.form;

    const whiteColumns = [{
      width: 150,
      title: '班级',
      dataIndex: 'clazz_name',
      key: 'clazz_name'
    }, {
      title: '学生姓名',
      dataIndex: 'student_name',
      key: 'student_name'
    }, {
      width: 150,
      title: '学号',
      dataIndex: 'student_number'
    }, {
      width: 90,
      title: constant.action,
      dataIndex: '',
      render: (text, record, index) => (
        <span>
          <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                      cancelText={constant.popconfirm_cancel}
                      onConfirm={this.props.handleStudentDelete.bind(this, record.course_student_id, 'white')}>
            <a>{constant.delete}</a>
          </Popconfirm>
        </span>
      )
    }];

    const blackColumns = [{
      width: 150,
      title: '班级',
      dataIndex: 'clazz_name',
      key: 'clazz_name'
    }, {
      title: '学生姓名',
      dataIndex: 'student_name',
      key: 'student_name'
    }, {
      width: 150,
      title: '学号',
      dataIndex: 'student_number'
    }, {
      width: 90,
      title: constant.action,
      dataIndex: '',
      render: (text, record, index) => (
        <span>
          <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                      cancelText={constant.popconfirm_cancel}
                      onConfirm={this.props.handleStudentDelete.bind(this, record.course_student_id, 'black')}>
            <a>{constant.delete}</a>
          </Popconfirm>
        </span>
      )
    }];

    return (
      <Modal title={'课程表单'} maskClosable={false} width={constant.detail_width}
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

          <FormItem hasFeedback {...constant.formItemFullLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_full_width}} label="所属班级">
            {
              getFieldDecorator('clazz_id', {
                rules: [{
                  required: true,
                  message: constant.required,
                  type: 'array'
                }],
                initialValue: []
              })(
                <Select multiple style={{
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
                    style={{width: constant.detail_form_item_width}} label="课程老师">
            {
              getFieldDecorator('course_teacher', {
                rules: [{
                  required: true,
                  message: constant.required
                }],
                initialValue: ''
              })(
                <Input type="text" placeholder={constant.placeholder + '课程老师'}/>
              )
            }
          </FormItem>

          <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_width}} label="课程名称">
            {
              getFieldDecorator('course_name', {
                rules: [{
                  required: true,
                  message: constant.required
                }],
                initialValue: ''
              })(
                <Input type="text" placeholder={constant.placeholder + '课程名称'}/>
              )
            }
          </FormItem>
          <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_width}} label="课程时间">
            {
              getFieldDecorator('course_time', {
                rules: [{
                  required: true,
                  message: constant.required
                }],
                initialValue: ''
              })(
                <Select style={{
                  width: '100%'
                }} placeholder="请选择课程时间">
                  <Option value="17">星期一第七节</Option>
                  <Option value="27">星期二第七节</Option>
                  <Option value="28">星期二第八节</Option>
                  <Option value="47">星期四第七节</Option>
                  <Option value="48">星期四第八节</Option>
                  <Option value="56">星期五第六节</Option>
                </Select>
              )
            }
          </FormItem>

          <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_width}} label="申请限制">
            {
              getFieldDecorator('course_apply_limit', {
                rules: [{
                  required: true,
                  message: constant.required
                }],
                initialValue: 0
              })(
                <InputNumber type="text" className={style.formItemInput} placeholder={constant.placeholder + '申请限制'}
                             min={0} max={999}/>
              )
            }
          </FormItem>

          <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_width}} label="课程地址">
            {
              getFieldDecorator('course_address', {
                initialValue: ''
              })(
                <Input type="text" placeholder={constant.placeholder + '课程地址'}/>
              )
            }
          </FormItem>


          <FormItem hasFeedback {...constant.formItemFullLayoutDetail} className={style.formItemInputImageMarginBottom}
                    style={{width: constant.detail_form_item_full_width}} label="课程图片">
            <InputImage ref="course_image"/>
          </FormItem>

          <FormItem hasFeedback {...constant.formItemFullLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_full_width}} label="课程介绍">
            {
              getFieldDecorator('course_content', {
                initialValue: ''
              })(
                <Input type="textarea" rows={8} placeholder={constant.placeholder + '课程介绍'}/>
              )
            }
          </FormItem>

          <FormItem hasFeedback {...constant.formItemFullLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_full_width}} label="白名单">
            <Button key="white" type="ghost" size="default" icon="plus-circle"
                    onClick={this.handleWhile.bind(this)} style={{marginBottom: '15px'}}>新增白名单</Button>
            <Table columns={whiteColumns} dataSource={this.props.white} pagination={false} size="middle" bordered/>
          </FormItem>

          <FormItem hasFeedback {...constant.formItemFullLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_full_width}} label="黑名单">
            <Button key="black" type="ghost" size="default" icon="plus-circle"
                    onClick={this.handleBlack.bind(this)} style={{marginBottom: '15px'}}>新增黑名单</Button>
            <Table columns={blackColumns} dataSource={this.props.black} pagination={false} size="middle" bordered/>
          </FormItem>

          <StudentHelp clazz={this.props.clazz} handleSubmitReturn={this.handleSubmitReturn.bind(this)} ref="student_help"/>

        </Spin>
      </Modal>
    );
  }
}

CourseDetail.propTypes = {
  is_load: React.PropTypes.bool.isRequired,
  is_detail: React.PropTypes.bool.isRequired,
  clazz: React.PropTypes.array.isRequired,
  teacher: React.PropTypes.array.isRequired,
  white: React.PropTypes.array.isRequired,
  black: React.PropTypes.array.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
  handleCancel: React.PropTypes.func.isRequired,
  handleWhiteSave: React.PropTypes.func.isRequired,
  handleBlackSave: React.PropTypes.func.isRequired,
  handleStudentDelete: React.PropTypes.func.isRequired
};

CourseDetail = Form.create({
  withRef: true
})(CourseDetail);

export default CourseDetail;
