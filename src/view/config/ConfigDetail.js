import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Spin, Button, Input, message} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';
import style from '../style.css';

class ConfigDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false,
      is_show: false,
      action: '',
      config_id: ''
    }
  }

  componentDidMount() {
    notification.on('notification_config_detail_save', this, function (data) {
      this.setState({
        is_show: true,
        action: 'save'
      });
    });

    notification.on('notification_config_detail_update', this, function (data) {
      this.setState({
        is_show: true,
        action: 'update',
        config_id: data.config_id
      });

      this.handleLoad(data.config_id);
    });
  }

  componentWillUnmount() {
    notification.remove('notification_config_detail_save', this);

    notification.remove('notification_config_detail_update', this);
  }

  handleLoad(config_id) {
    this.setState({
      is_load: true
    });

    http.request({
      url: '/config/admin/find',
      data: {
        config_id: config_id
      },
      success: function (json) {
        this.props.form.setFieldsValue({
          category_id: json.data.category_id,
          config_name: json.data.config_name
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

      values.config_id = this.state.config_id;

      this.setState({
        is_load: true
      });

      http.request({
        url: '/config/' + this.state.action,
        data: values,
        success: function (json) {
          message.success(constant.success);

          this.handleCancel();

          notification.emit('notification_config_index_load', {});
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
  }

  render() {
    const FormItem = Form.Item;
    const {getFieldDecorator} = this.props.form;

    return (
      <Modal title={'系统配置表单'} maskClosable={false} width={constant.detail_width}
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
                      style={{width: constant.detail_form_item_width}} label="开始时间">
              {
                getFieldDecorator('config_apply_start_time', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '开始时间'}/>
                )
              }
            </FormItem>

            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="结束时间">
              {
                getFieldDecorator('config_apply_end_time', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '结束时间'}/>
                )
              }
            </FormItem>
</form>
        </Spin>
      </Modal>
    );
  }
}

ConfigDetail.propTypes = {

};

ConfigDetail = Form.create({})(ConfigDetail);

export default connect(({config}) => ({
  config
}))(ConfigDetail);
