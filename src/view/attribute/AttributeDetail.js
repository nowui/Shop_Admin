import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Spin, Button, Input, InputNumber, message} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';
import style from '../style.css';

class AttributeDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false,
      is_show: false,
      action: '',
      attribute_id: ''
    }
  }

  componentDidMount() {
    notification.on('notification_attribute_detail_save', this, function (data) {
      this.setState({
        is_show: true,
        action: 'save'
      });
    });

    notification.on('notification_attribute_detail_update', this, function (data) {
      this.setState({
        is_show: true,
        action: 'update',
        attribute_id: data.attribute_id
      });

      this.handleLoad(data.attribute_id);
    });
  }

  componentWillUnmount() {
    notification.remove('notification_attribute_detail_save', this);

    notification.remove('notification_attribute_detail_update', this);
  }

  handleLoad(attribute_id) {
    this.setState({
      is_load: true
    });

    http.request({
      url: '/attribute/admin/find',
      data: {
        attribute_id: attribute_id
      },
      success: function (json) {
        this.props.form.setFieldsValue({
          category_id: json.data.category_id,
          attribute_name: json.data.attribute_name
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

      values.attribute_id = this.state.attribute_id;

      this.setState({
        is_load: true
      });

      http.request({
        url: '/attribute/admin/' + this.state.action,
        data: values,
        success: function (json) {
          message.success(constant.success);

          this.handleCancel();

          notification.emit('notification_attribute_index_load', {});
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
      <Modal title={'属性表单'} maskClosable={false} width={constant.detail_width}
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
                      style={{width: constant.detail_form_item_width}} label="属性名称">
              {
                getFieldDecorator('attribute_name', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '属性名称'}/>
                )
              }
            </FormItem>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="输入类型">
              {
                getFieldDecorator('attribute_input_type', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '输入类型'}/>
                )
              }
            </FormItem>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="默认值">
              {
                getFieldDecorator('attribute_default_value', {
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '默认值'}/>
                )
              }
            </FormItem>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="属性类型">
              {
                getFieldDecorator('attribute_type', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '属性类型'}/>
                )
              }
            </FormItem>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="属性排序">
              {
                getFieldDecorator('attribute_sort', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: 0
                })(
                  <InputNumber type="text" className={style.formItemInput} placeholder={constant.placeholder + '属性排序'}
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

AttributeDetail.propTypes = {};

AttributeDetail = Form.create({})(AttributeDetail);

export default connect(({attribute}) => ({
  attribute
}))(AttributeDetail);
