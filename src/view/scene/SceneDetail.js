import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Spin, Button, Input, InputNumber, message} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';
import style from '../style.css';

class SceneDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false,
      is_show: false,
      action: '',
      scene_id: ''
    }
  }

  componentDidMount() {
    notification.on('notification_scene_detail_save', this, function (data) {
      this.setState({
        is_show: true,
        action: 'save'
      });
    });

    notification.on('notification_scene_detail_update', this, function (data) {
      this.setState({
        is_show: true,
        action: 'update',
        scene_id: data.scene_id
      });

      this.handleLoad(data.scene_id);
    });
  }

  componentWillUnmount() {
    notification.remove('notification_scene_detail_save', this);

    notification.remove('notification_scene_detail_update', this);
  }

  handleLoad(scene_id) {
    this.setState({
      is_load: true
    });

    http.request({
      url: '/scene/admin/find',
      data: {
        scene_id: scene_id
      },
      success: function (json) {
        this.props.form.setFieldsValue({
          category_id: json.data.category_id,
          scene_name: json.data.scene_name
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

      values.scene_id = this.state.scene_id;

      this.setState({
        is_load: true
      });

      http.request({
        url: '/scene/admin/' + this.state.action,
        data: values,
        success: function (json) {
          message.success(constant.success);

          this.handleCancel();

          notification.emit('notification_scene_index_load', {});
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
      <Modal title={'二维码表单'} maskClosable={false} width={constant.detail_width}
             visible={this.state.is_show} onCancel={this.handleCancel.bind(this)}
             footer={[
               <Button key="back" type="ghost" size="default" icon="cross-circle"
                       onClick={this.handleCancel.bind(this)}>关闭</Button>,
               <Button key="submit" type="primary" size="default" icon="check-circle"
                       loading={this.state.is_load}
                       onClick={this.handleSubmit.bind(this)}>确定</Button>
             ]}
      >
        {
          this.state.action == 'update' ?
            <Spin spinning={this.state.is_load}>
              <form>
                <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                          style={{width: constant.detail_form_item_width}} label="场景类型">
                  {
                    getFieldDecorator('scene_type', {
                      rules: [{
                        required: true,
                        message: constant.required
                      }],
                      initialValue: ''
                    })(
                      <Input type="text" placeholder={constant.placeholder + '场景类型'}/>
                    )
                  }
                </FormItem>

                <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                          style={{width: constant.detail_form_item_width}} label="新增关注">
                  {
                    getFieldDecorator('scene_add', {
                      rules: [{
                        required: true,
                        message: constant.required
                      }],
                      initialValue: 0
                    })(
                      <InputNumber type="text" className={style.formItemInput}
                                   placeholder={constant.placeholder + '新增关注'}
                                   min={0} max={999}/>
                    )
                  }
                </FormItem>

                <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                          style={{width: constant.detail_form_item_width}} label="取消关注">
                  {
                    getFieldDecorator('scene_cancel', {
                      rules: [{
                        required: true,
                        message: constant.required
                      }],
                      initialValue: 0
                    })(
                      <InputNumber type="text" className={style.formItemInput}
                                   placeholder={constant.placeholder + '取消关注'}
                                   min={0} max={999}/>
                    )
                  }
                </FormItem>

                <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                          style={{width: constant.detail_form_item_width}} label="二维码图片">
                  {
                    this.state.scene_qrcode == '' ?
                      ''
                      :
                      <img src={this.state.scene_qrcode} style={{
                        width: '200px'
                      }}/>
                  }
                </FormItem>
              </form>
            </Spin>
            :
            ''
        }
      </Modal>
    );
  }
}

SceneDetail.propTypes = {};

SceneDetail = Form.create({})(SceneDetail);

export default connect(({scene}) => ({
  scene
}))(SceneDetail);
