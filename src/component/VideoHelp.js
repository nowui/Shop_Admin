import React, {Component, PropTypes} from 'react';
import {Modal, Button, Input, Form} from 'antd';

import constant from '../util/constant';
import http from '../util/http';
import notification from '../util/notification';
import style from './VideoHelp.css';

let request;

class VideoHelp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false,
      is_visible: false,
      is_add: false,
      image: '',
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

  handleOpen() {
    this.setState({
      is_visible: true
    });
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

      request = http({
        url: '/file/video/save',
        data: {
          file_name: values.file_name,
          file_path: values.file_path
        },
        success: function (json) {
          notification.emit('notification_file_video_save', json.data);
        }.bind(this),
        complete: function () {
          this.handleCancel();
        }.bind(this)
      }).post();
    });
  }

  handlePaginationChange(page, pageSize) {
    this.handleLoad(page);
  }

  render() {
    const FormItem = Form.Item;
    const {getFieldDecorator} = this.props.form;

    return (
      <Modal title="我的视频" visible={this.state.is_visible} maskClosable={false} width={constant.detail_width / 1.5}
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
