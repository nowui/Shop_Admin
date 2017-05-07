import React, {Component, PropTypes} from 'react';
import {Modal, Button, Input, Form, Upload, Icon, message} from 'antd';

import constant from '../util/constant';
import http from '../util/http';
import database from '../util/database';
import notification from '../util/notification';
import style from './FileHelp.css';

let request;

class VideoHelp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false,
      is_visible: false,
      is_add: true,
      file_id: '',
      list: [],
      page_index: 1,
      page_size: 36,
      total: 0
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    if (typeof(request) != 'undefined') {
      request.cancel();
    }
  }

  handleAdd() {
    this.setState({
      is_visible: true,
      is_add: true
    });
  }

  handleEdit(file_id) {
    this.setState({
      is_visible: true,
      is_add: false,
      file_id: file_id
    });

    request = http({
      url: '/file/find',
      data: {
        file_id: file_id
      },
      success: function (json) {
        this.props.form.setFieldsValue(json.data);
      }.bind(this),
      complete: function () {

      }.bind(this)
    }).post();
  }

  handleCancel() {
    this.setState({
      is_visible: false
    });

    this.props.form.resetFields();
  }

  handleSubmit() {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return;
      }

      values.file_id = this.state.file_id;

      request = http({
        url: this.state.is_add ? '/file/video/save' : '/file/update',
        data: values,
        success: function (json) {
          if (this.state.is_add) {
            notification.emit('notification_file_video_save', json.data);
          } else {
            notification.emit('notification_file_video_update', values);
          }
        }.bind(this),
        complete: function () {
          this.handleCancel();
        }.bind(this)
      }).post();
    });
  }

  handleChange(info) {
    if (info.file.status === 'done') {
      if (info.file.response.code == 200) {
        this.props.form.setFieldsValue({
          file_image: info.file.response.data[0].file_path
        });
        message.success(constant.success);
      } else {
        message.error(info.file.response.message);
      }

      this.setState({
        is_load: false
      });
    }
  }

  render() {
    const FormItem = Form.Item;
    const {getFieldDecorator} = this.props.form;
    const props = {
      name: 'file',
      multiple: false,
      showUploadList: false,
      action: constant.host + '/upload/image',
      accept: 'image/jpg,image/jpeg,image/png,image/gif',
      headers: {
        'Token': database.getToken(),
        'Platform': constant.platform,
        'Version': constant.version
      },
      onChange: this.handleChange.bind(this)
    };

    return (
      <Modal title="我的文件" visible={this.state.is_visible} maskClosable={false} width={constant.detail_width / 1.5}
             onCancel={this.handleCancel.bind(this)}
             footer={[
               <Button key="back" type="ghost" size="default" icon="cross-circle"
                       onClick={this.handleCancel.bind(this)}>关闭</Button>,
               <Button key="submit" type="primary" size="default" icon="check-circle"
                       loading={this.state.is_load}
                       onClick={this.handleSubmit.bind(this)}>确定</Button>
             ]}
      >

        <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                  style={{width: constant.detail_form_item_width}} label="名称">
          {
            getFieldDecorator('file_name', {
              rules: [{
                required: true,
                message: constant.required
              }],
              initialValue: ''
            })(
              <Input type="text" placeholder={constant.placeholder + '名称'}/>
            )
          }
        </FormItem>

        <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                  style={{width: constant.detail_form_item_width}} label="地址">
          {
            getFieldDecorator('file_path', {
              rules: [{
                required: true,
                message: constant.required
              }],
              initialValue: ''
            })(
              <Input type="text" placeholder={constant.placeholder + '地址'}/>
            )
          }
        </FormItem>

        <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                  style={{width: constant.detail_form_item_width}} label="封面">
          {
            getFieldDecorator('file_image', {
              rules: [{
                required: true,
                message: constant.required
              }],
              initialValue: ''
            })(
              <Input type="text" placeholder={constant.placeholder + '封面'}/>
            )
          }
          <Upload {...props}>
            <Button type="ghost" size="small" loading={this.state.is_load}>
              <Icon type="cloud-upload"/>上传封面
            </Button>
          </Upload>
        </FormItem>
      </Modal>
    );
  }
}

VideoHelp.propTypes = {
  type: React.PropTypes.string,
  limit: React.PropTypes.number.isRequired,
  handleSubmitReturn: React.PropTypes.func.isRequired
};

VideoHelp.defaultProps = {
  type: ''
};

VideoHelp = Form.create({
  withRef: true
})(VideoHelp);

export default VideoHelp;
