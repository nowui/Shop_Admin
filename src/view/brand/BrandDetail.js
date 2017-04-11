import React, {Component, PropTypes} from 'react';
import {Modal, Form, Spin, Button, Input} from 'antd';
import InputImage from '../../component/InputImage';
import InputHtml from '../../component/InputHtml';

import constant from '../../util/constant';
import style from '../style.css';

class BrandDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  handleSetFieldsValue(values) {
    this.props.form.setFieldsValue(values);

    this.refs.brand_image.handleSetList(JSON.parse(values.brand_image));

    this.refs.brand_content.handleSetContent(values.brand_content);
  }

  handleSubmit() {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return;
      }

      values.brand_image = JSON.stringify(this.refs.brand_image.handleGetList());

      values.brand_content = this.refs.brand_content.handleGetContent();

      this.props.handleSubmit(values);
    });
  }

  handleCancel() {
    this.props.handleCancel();
  }

  handleReset() {
    this.props.form.resetFields();

    this.refs.brand_image.handleReset();

    this.refs.brand_content.handleReset();
  }

  render() {
    const FormItem = Form.Item;
    const {getFieldDecorator} = this.props.form;

    return (
      <Modal title={'品牌表单'} maskClosable={false} width={constant.detail_width}
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
                    style={{width: constant.detail_form_item_full_width}} label="课程图片">
            <InputImage ref="brand_image"/>
          </FormItem>

          <FormItem hasFeedback {...constant.formItemFullLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_full_width}} label="品牌内容">
            <InputHtml ref="brand_content"/>
          </FormItem>

        </Spin>
      </Modal>
    );
  }
}

BrandDetail.propTypes = {
  is_load: React.PropTypes.bool.isRequired,
  is_detail: React.PropTypes.bool.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
  handleCancel: React.PropTypes.func.isRequired
};

BrandDetail = Form.create({
  withRef: true
})(BrandDetail);

export default BrandDetail;
