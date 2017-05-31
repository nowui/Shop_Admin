import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Spin, Button, Input, InputNumber, message} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';
import style from '../style.css';

class CategoryDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false,
      is_show: false,
      is_tree: false,
      action: '',
      category_id: '',
      parent_id: ''
    }
  }

  componentDidMount() {
    notification.on('notification_category_detail_save', this, function (data) {
      this.setState({
        is_show: true,
        is_tree: data.is_tree,
        action: 'save',
        parent_id: data.parent_id
      });
    });

    notification.on('notification_category_detail_update', this, function (data) {
      new Promise(function (resolve, reject) {
        this.setState({
          is_show: true,
          is_tree: data.is_tree,
          action: 'update',
          category_id: data.category_id
        });

        resolve();
      }.bind(this)).then(function () {
        this.handleLoad();
      }.bind(this));
    });
  }

  componentWillUnmount() {
    notification.remove('notification_category_detail_save', this);

    notification.remove('notification_category_detail_update', this);
  }

  handleLoad() {
    this.setState({
      is_load: true
    });

    http.request({
      url: '/category/admin/find',
      data: {
        category_id: this.state.category_id
      },
      success: function (json) {
        this.props.form.setFieldsValue({
          category_name: json.data.category_name,
          category_key: json.data.category_key,
          category_value: json.data.category_value,
          category_remark: json.data.category_remark,
          category_sort: json.data.category_sort
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

      values.category_id = this.state.category_id;

      if (this.state.action == 'save') {
        values.parent_id = this.state.parent_id;
      }

      this.setState({
        is_load: true
      });

      http.request({
        url: '/category/' + this.state.action,
        data: values,
        success: function (json) {
          message.success(constant.success);

          this.handleCancel();

          if (this.state.is_tree) {
            notification.emit('notification_category_tree_load', {});
          } else {
            notification.emit('notification_category_index_load', {});
          }
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
      <Modal title={'分类表单'} maskClosable={false} width={constant.detail_width} zIndex={2}
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
          <from>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="分类名称">
              {
                getFieldDecorator('category_name', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '分类名称'}/>
                )
              }
            </FormItem>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="分类键值">
              {
                getFieldDecorator('category_key', {
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '分类键值'}/>
                )
              }
            </FormItem>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="分类数值">
              {
                getFieldDecorator('category_value', {
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '分类数值'}/>
                )
              }
            </FormItem>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="分类描述">
              {
                getFieldDecorator('category_remark', {
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '分类描述'}/>
                )
              }
            </FormItem>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="分类排序">
              {
                getFieldDecorator('category_sort', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: 0
                })(
                  <InputNumber type="text" className={style.formItemInput} placeholder={constant.placeholder + '分类排序'}
                               min={0} max={999}/>
                )
              }
            </FormItem>
          </from>
        </Spin>
      </Modal>
    );
  }
}

CategoryDetail.propTypes = {};

CategoryDetail = Form.create({})(CategoryDetail);

export default connect(({category}) => ({
  category
}))(CategoryDetail);
