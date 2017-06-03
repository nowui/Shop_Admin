import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Spin, Button, Input, InputNumber, message} from 'antd';
import InputImage from '../../component/InputImage';
import InputHtml from '../../component/InputHtml';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';
import style from '../style.css';

class DoctorDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false,
      is_show: false,
      action: '',
      doctor_id: ''
    }
  }

  componentDidMount() {
    notification.on('notification_doctor_detail_save', this, function (data) {
      this.setState({
        is_show: true,
        action: 'save'
      });
    });

    notification.on('notification_doctor_detail_update', this, function (data) {
      this.setState({
        is_show: true,
        action: 'update',
        doctor_id: data.doctor_id
      });

      this.handleLoad(data.doctor_id);
    });
  }

  componentWillUnmount() {
    notification.remove('notification_doctor_detail_save', this);

    notification.remove('notification_doctor_detail_update', this);
  }

  handleLoad(doctor_id) {
    this.setState({
      is_load: true
    });

    http.request({
      url: '/doctor/admin/find',
      data: {
        doctor_id: doctor_id
      },
      success: function (json) {
        this.props.form.setFieldsValue({
          doctor_name: json.data.doctor_name
        });

        var doctor_image = [];
        if (json.data.doctor_image_file != '') {
          doctor_image.push(json.data.doctor_image_file);
        }
        this.refs.doctor_image.handleSetValue(doctor_image);

        this.refs.doctor_content.handleSetValue(json.data.doctor_content);
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

      values.doctor_id = this.state.doctor_id;

      var doctor_image_file = this.refs.doctor_image.handleGetValue();
      if (doctor_image_file.length == 0) {
        values.doctor_image = '';
      } else {
        values.doctor_image = doctor_image_file[0].file_id;
      }

      values.doctor_content = this.refs.doctor_content.handleGetValue();

      this.setState({
        is_load: true
      });

      http.request({
        url: '/doctor/admin/' + this.state.action,
        data: values,
        success: function (json) {
          message.success(constant.success);

          this.handleCancel();

          notification.emit('notification_doctor_index_load', {});
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

    this.refs.doctor_image.handleReset();

    this.refs.doctor_content.handleReset();
  }

  render() {
    const FormItem = Form.Item;
    const {getFieldDecorator} = this.props.form;

    return (
      <Modal title={'医生表单'} maskClosable={false} width={constant.detail_width}
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
                      style={{width: constant.detail_form_item_width}} label="医生名称">
              {
                getFieldDecorator('doctor_name', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '医生名称'}/>
                )
              }
            </FormItem>
            <FormItem hasFeedback {...constant.formItemFullLayoutDetail} className={style.formItemInputImageMarginBottom}
                      style={{width: constant.detail_form_item_full_width}} label="医生图片">
              <InputImage name="doctor_image" limit={1} ref="doctor_image"/>
            </FormItem>
            <FormItem hasFeedback {...constant.formItemFullLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_full_width}} label="医生介绍">
              <InputHtml name="doctor_content" ref="doctor_content"/>
            </FormItem>
          </form>
        </Spin>
      </Modal>
    );
  }
}

DoctorDetail.propTypes = {};

DoctorDetail = Form.create({})(DoctorDetail);

export default connect(({doctor}) => ({
  doctor
}))(DoctorDetail);
