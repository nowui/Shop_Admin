import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Spin, Button, Input, InputNumber, TreeSelect, message} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';
import style from '../style.css';

class RoleDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false,
      is_show: false,
      action: '',
      role_id: ''
    }
  }

  componentDidMount() {
    notification.on('notification_role_detail_save', this, function (data) {
      this.setState({
        is_show: true,
        action: 'save'
      });
    });

    notification.on('notification_role_detail_update', this, function (data) {
      this.setState({
        is_show: true,
        action: 'update',
        role_id: data.role_id
      });

      this.handleLoad(data.role_id);
    });
  }

  componentWillUnmount() {
    notification.remove('notification_role_detail_save', this);

    notification.remove('notification_role_detail_update', this);
  }

  handleLoad(role_id) {
    this.setState({
      is_load: true
    });

    http.request({
      url: '/role/admin/find',
      data: {
        role_id: role_id
      },
      success: function (json) {
        this.props.form.setFieldsValue({
          category_id: json.data.category_id,
          role_name: json.data.role_name,
          role_key: json.data.role_key,
          role_sort: json.data.role_sort
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

      values.role_id = this.state.role_id;

      this.setState({
        is_load: true
      });

      http.request({
        url: '/role/admin/' + this.state.action,
        data: values,
        success: function (json) {
          message.success(constant.success);

          this.handleCancel();

          notification.emit('notification_role_index_load', {});
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
      <Modal title={'角色表单'} maskClosable={false} width={constant.detail_width}
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
                    treeData={this.props.role.category_list}
                  />
                )
              }
            </FormItem>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="角色名称">
              {
                getFieldDecorator('role_name', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '角色名称'}/>
                )
              }
            </FormItem>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="角色键值">
              {
                getFieldDecorator('role_key', {
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '角色键值'}/>
                )
              }
            </FormItem>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="角色排序">
              {
                getFieldDecorator('role_sort', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: 0
                })(
                  <InputNumber type="text" className={style.formItemInput} placeholder={constant.placeholder + '角色排序'}
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

RoleDetail.propTypes = {};

RoleDetail = Form.create({})(RoleDetail);

export default connect(({role}) => ({
  role
}))(RoleDetail);
