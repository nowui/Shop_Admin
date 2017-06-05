import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Spin, Button, Input, InputNumber, message} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';
import style from '../style.css';

class FileDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false,
      is_show: false,
      action: '',
      file_id: ''
    }
  }

  componentDidMount() {
    notification.on('notification_file_detail_save', this, function (data) {
      this.setState({
        is_show: true,
        action: 'save'
      });
    });

    notification.on('notification_file_detail_update', this, function (data) {
      this.setState({
        is_show: true,
        action: 'update',
        file_id: data.file_id
      });

      this.handleLoad(data.file_id);
    });
  }

  componentWillUnmount() {
    notification.remove('notification_file_detail_save', this);

    notification.remove('notification_file_detail_update', this);
  }

  handleLoad(file_id) {
    this.setState({
      is_load: true
    });

    http.request({
      url: '/file/admin/find',
      data: {
        file_id: file_id
      },
      success: function (json) {
        this.props.form.setFieldsValue({
          file_type: json.data.file_type,
          file_name: json.data.file_name,
          file_suffix: json.data.file_suffix,
          file_size: json.data.file_size,
          file_path: json.data.file_path,
          file_thumbnail_path: json.data.file_thumbnail_path,
          file_original_path: json.data.file_original_path,
          file_image: json.data.file_image
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
    this.handleCancel();
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
      <Modal title={'表单'} maskClosable={false} width={constant.detail_width}
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
                      style={{width: constant.detail_form_item_width}} label="文件类型">
              {
                getFieldDecorator('file_type', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '文件类型'}/>
                )
              }
            </FormItem>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="文件名称">
              {
                getFieldDecorator('file_name', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '文件名称'}/>
                )
              }
            </FormItem>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="文件后缀">
              {
                getFieldDecorator('file_suffix', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '文件后缀'}/>
                )
              }
            </FormItem>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="文件大小">
              {
                getFieldDecorator('file_size', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: 0
                })(
                  <InputNumber type="text" className={style.formItemInput} placeholder={constant.placeholder + '文件大小'}
                             min={0} max={999}/>
                )
              }
            </FormItem>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="文件路径">
              {
                getFieldDecorator('file_path', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '文件路径'}/>
                )
              }
            </FormItem>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="文件路径">
              {
                getFieldDecorator('file_thumbnail_path', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '文件路径'}/>
                )
              }
            </FormItem>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="文件路径">
              {
                getFieldDecorator('file_original_path', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '文件路径'}/>
                )
              }
            </FormItem>
            <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_width}} label="文件封面">
              {
                getFieldDecorator('file_image', {
                  rules: [{
                    required: true,
                    message: constant.required
                  }],
                  initialValue: ''
                })(
                  <Input type="text" placeholder={constant.placeholder + '文件封面'}/>
                )
              }
            </FormItem>
          </form>
        </Spin>
      </Modal>
    );
  }
}

FileDetail.propTypes = {};

FileDetail = Form.create({})(FileDetail);

export default connect(({file}) => ({
  file
}))(FileDetail);
