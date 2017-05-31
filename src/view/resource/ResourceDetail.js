import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Spin, Button, Input, InputNumber, Select, TreeSelect, message} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';
import style from '../style.css';

class ResourceDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false,
      is_show: false,
      action: '',
      resource_id: ''
    }
  }

  componentDidMount() {
    notification.on('notification_resource_detail_save', this, function (data) {
      this.setState({
        is_show: true,
        action: 'save'
      });
    });

    notification.on('notification_resource_detail_update', this, function (data) {
      this.setState({
        is_show: true,
        action: 'update',
        resource_id: data.resource_id
      });

      this.handleLoad(data.resource_id);
    });
  }

  componentWillUnmount() {
    notification.remove('notification_resource_detail_save', this);

    notification.remove('notification_resource_detail_update', this);
  }

  handleLoad(resource_id) {
    this.setState({
      is_load: true
    });

    http.request({
      url: '/resource/admin/find',
      data: {
        resource_id: resource_id
      },
      success: function (json) {
        this.props.form.setFieldsValue({
          category_id: json.data.category_id,
          resource_type: json.data.resource_type,
          resource_name: json.data.resource_name,
          resource_key: json.data.resource_key,
          resource_value: json.data.resource_value,
          resource_sort: json.data.resource_sort
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

      values.resource_id = this.state.resource_id;

      this.setState({
        is_load: true
      });

      http.request({
        url: '/resource/' + this.state.action,
        data: values,
        success: function (json) {
          message.success(constant.success);

          this.handleCancel();

          notification.emit('notification_resource_index_load', {});
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
    const Option = Select.Option;
    const {getFieldDecorator} = this.props.form;

    return (
      <Modal title={'资源表单'} maskClosable={false} width={constant.detail_width}
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
                      style={{width: constant.detail_form_item_width}} label="所属分类">
              {
                getFieldDecorator('category_id', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <TreeSelect
                    placeholder="请选择所属分类"
                    allowClear
                    treeDefaultExpandAll
                    treeData={this.props.resource.category_list}
                  />
                )
              }
            </FormItem>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="资源类型">
              {
                getFieldDecorator('resource_type', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: 'URL'
                })(
                  <Select placeholder="请选择资源类型" className={style.formItemInput}>
                    <Option key="URL" value="URL">链接</Option>
                    <Option key="BUTTON" value="BUTTON">按钮</Option>
                  </Select>
                )
              }
            </FormItem>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="资源名称">
              {
                getFieldDecorator('resource_name', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '资源名称'}/>
                )
              }
            </FormItem>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="资源键值">
              {
                getFieldDecorator('resource_key', {
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '资源键值'}/>
                )
              }
            </FormItem>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="资源数值">
              {
                getFieldDecorator('resource_value', {
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '资源数值'}/>
                )
              }
            </FormItem>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="资源排序">
              {
                getFieldDecorator('resource_sort', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: 0
                })(
                  <InputNumber type="text" className={style.formItemInput} placeholder={constant.placeholder + '资源排序'}
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

ResourceDetail.propTypes = {};

ResourceDetail = Form.create({})(ResourceDetail);

export default connect(({resource}) => ({
  resource
}))(ResourceDetail);
