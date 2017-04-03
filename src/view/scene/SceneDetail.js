import React, {Component, PropTypes} from 'react';
import {Modal, Form, Spin, Button, Input, InputNumber} from 'antd';

import constant from '../../util/constant';
import style from '../style.css';

class SceneDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  handleSubmit() {
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }

      this.props.handleSubmit(values);
    });
  }

  handleCancel() {
    this.props.handleCancel();
  }

  handleReset() {
    this.props.form.resetFields();
  }

  render() {
    const FormItem = Form.Item;
    const {getFieldDecorator} = this.props.form;

    return (
      <Modal title={'二维码表单'} maskClosable={false} width={constant.detail_width}
             visible={this.props.is_detail} onCancel={this.handleCancel.bind(this)}
             footer={[
               <Button key="back" type="ghost" size="default" icon="cross-circle"
                       onClick={this.handleCancel.bind(this)}>关闭</Button>,
               <Button key="submit" type="primary" size="default" icon="check-circle"
                       loading={this.props.is_load}
                       onClick={this.handleSubmit.bind(this)}>确定</Button>
             ]}
      >
        <Spin spinning={this.props.is_load}>

          <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_width}} label="外键编号">
            {
              getFieldDecorator('object_id', {
                rules: [{
                  required: true,
                  message: constant.required
                }],
                initialValue: ''
              })(
                <Input type="text" placeholder={constant.placeholder + '外键编号'}/>
              )
            }
          </FormItem>

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
                <InputNumber type="text" className={style.formItemInput} placeholder={constant.placeholder + '新增关注'}
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
                <InputNumber type="text" className={style.formItemInput} placeholder={constant.placeholder + '取消关注'}
                             min={0} max={999}/>
              )
            }
          </FormItem>

          <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_width}} label="二维码">
            {
              getFieldDecorator('scene_qrcode', {
                rules: [{
                  required: true,
                  message: constant.required
                }],
                initialValue: ''
              })(
                <Input type="text" placeholder={constant.placeholder + '二维码'}/>
              )
            }
          </FormItem>

        </Spin>
      </Modal>
    );
  }
}

SceneDetail.propTypes = {
  is_load: React.PropTypes.bool.isRequired,
  is_detail: React.PropTypes.bool.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
  handleCancel: React.PropTypes.func.isRequired
};

SceneDetail = Form.create({
  withRef: true
})(SceneDetail);

export default SceneDetail;
