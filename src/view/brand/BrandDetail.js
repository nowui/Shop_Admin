import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Spin, Button, Input, message} from 'antd';
import InputImage from '../../component/InputImage';
import InputHtml from '../../component/InputHtml';

import constant from '../../util/constant';
import notification from '../../util/notification';
import request from '../../util/request';
import style from '../style.css';

class BrandDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false,
      is_show: false,
      action: '',
      brand_id: ''
    }
  }

  componentDidMount() {
    notification.on('notification_brand_detail_save', this, function (data) {
      this.setState({
        is_show: true,
        action: 'save'
      });
    });

    notification.on('notification_brand_detail_update', this, function (data) {
      this.setState({
        is_show: true,
        action: 'update',
        brand_id: data.brand_id
      });

      setTimeout(function () {
        this.handleLoad(data.brand_id);
      }.bind(this), 200);
    });
  }

  componentWillUnmount() {
    notification.remove('notification_brand_detail_save', this);

    notification.remove('notification_brand_detail_update', this);
  }

  handleLoad(brand_id) {
    this.setState({
      is_load: true
    });

    request.post({
      url: '/brand/admin/find',
      data: {
        brand_id: brand_id
      },
      success: function (json) {
        this.props.form.setFieldsValue({
          brand_name: json.data.brand_name
        });

        var brand_image = [];
        if (json.data.brand_image_file != '') {
          brand_image.push(json.data.brand_image_file);
        }
        this.refs.brand_image.handleSetValue(brand_image);

        this.refs.brand_content.handleSetValue(json.data.brand_content);
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

      values.brand_id = this.state.brand_id;

      var brand_image_file = this.refs.brand_image.handleGetValue();
      if (brand_image_file.length == 0) {
        values.brand_image = '';
      } else {
        values.brand_image = brand_image_file[0].file_id;
      }

      values.brand_content = this.refs.brand_content.handleGetValue();

      request.post({
        url: '/brand/' + this.state.action,
        data: values,
        success: function (json) {
          message.success(constant.success);

          this.handleCancel();

          notification.emit('notification_brand_index_load', {});
        }.bind(this),
        complete: function () {

        }.bind(this)
      });
    });
  }

  handleCancel() {
    this.setState({
      is_show: false
    });

    this.props.form.resetFields();

    this.refs.brand_image.handleReset();

    this.refs.brand_content.handleReset();
  }

  render() {
    const FormItem = Form.Item;
    const {getFieldDecorator} = this.props.form;

    return (
      <Modal title={'品牌表单'} maskClosable={false} width={constant.detail_width}
             visible={this.state.is_show} onCancel={this.handleCancel.bind(this)}
             footer={[
               <Button key="back" type="ghost" size="default" icon="cross-circle"
                       onClick={this.handleCancel.bind(this)}>关闭</Button>,
               <Button key="submit" type="primary" size="default" icon="check-circle"
                       loading={this.props.is_load}
                       onClick={this.handleSubmit.bind(this)}>确定</Button>
             ]}
      >
        <Spin spinning={this.state.is_load}>

          <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_width}} label="品牌名称">
            {
              getFieldDecorator('brand_name', {
                rules: [{
                  required: true,
                  message: constant.required
                }],
                initialValue: ''
              })(
                <Input type="text" placeholder={constant.placeholder + '品牌名称'}/>
              )
            }
          </FormItem>

          <FormItem hasFeedback {...constant.formItemFullLayoutDetail} className={style.formItemInputImageMarginBottom}
                    style={{width: constant.detail_form_item_full_width}} label="品牌图片">
            <InputImage name="brand_image" limit={1} ref="brand_image"/>
          </FormItem>

          <FormItem hasFeedback {...constant.formItemFullLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_full_width}} label="品牌内容">
            <InputHtml name="brand_content" ref="brand_content"/>
          </FormItem>

        </Spin>
      </Modal>
    );
  }
}

BrandDetail.propTypes = {

};

BrandDetail = Form.create({})(BrandDetail);

export default connect(({brand}) => ({
  brand
}))(BrandDetail);
