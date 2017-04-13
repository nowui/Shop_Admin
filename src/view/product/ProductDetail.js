import React, {Component, PropTypes} from 'react';
import {Modal, Form, Spin, Button, Input, InputNumber, Checkbox, Select} from 'antd';
import InputImage from '../../component/InputImage';
import InputHtml from '../../component/InputHtml';

import constant from '../../util/constant';
import style from '../style.css';

class ProductDetail extends Component {
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

    let sku_list = values.sku_list;

    for (let i = 0; i < sku_list.length; i++) {
      let sku = sku_list[i];

      if (sku.product_attribute = '[]') {
        let product_price = JSON.parse(sku.product_price);
        for (let j = 0; j < product_price.length; j++) {
          let object = {};
          object['product_price_list.' + product_price[j].member_level_id] = product_price[j].product_price;
          this.props.form.setFieldsValue(object);
        }
      }
    }

    this.refs.product_image.handleSetList(JSON.parse(values.product_image));

    this.refs.product_image_list.handleSetList(JSON.parse(values.product_image_list));

    this.refs.product_content.handleSetContent(values.product_content);
  }

  handleSubmit() {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return;
      }

      values.product_image = JSON.stringify(this.refs.product_image.handleGetList());

      values.product_image_list = JSON.stringify(this.refs.product_image_list.handleGetList());

      values.product_content = this.refs.product_content.handleGetContent();

      let sku_list = [];

      let product_price = [];

      product_price.push({
        member_level_id: '',
        member_level_name: '',
        product_price: values.product_price
      });

      for (let i = 0; i < this.props.member_level_list.length; i++) {
        product_price.push({
          member_level_id: this.props.member_level_list[i].member_level_id,
          member_level_name: this.props.member_level_list[i].member_level_name,
          product_price: this.props.form.getFieldValue('product_price_list.' + this.props.member_level_list[i].member_level_id)
        });
      }

      delete values.product_price_list;

      sku_list.push({
        product_attribute: JSON.stringify([]),
        product_price: JSON.stringify(product_price),
        product_stock: values.product_stock
      });

      values.sku_list = sku_list;

      this.props.handleSubmit(values);
    });
  }

  handleCancel() {
    this.props.handleCancel();
  }

  handleReset() {
    this.props.form.resetFields();

    this.refs.product_image.handleReset();

    this.refs.product_image_list.handleReset();

    this.refs.product_content.handleReset();
  }

  render() {
    const FormItem = Form.Item;
    const Option = Select.Option;
    const {getFieldDecorator} = this.props.form;

    return (
      <Modal title={'商品表单'} maskClosable={false} width={constant.detail_width}
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
                    style={{width: constant.detail_form_item_width}} label="分类编号">
            {
              getFieldDecorator('category_id', {
                rules: [{
                  required: true,
                  message: constant.required
                }],
                initialValue: ''
              })(
                <Select style={{
                  width: '100%'
                }} placeholder="请选择分类">
                  {
                    this.props.category_list.map(function (item) {
                      return (
                        <Option key={item.category_id} value={item.category_id}>{item.category_name}</Option>
                      )
                    })
                  }
                </Select>
              )
            }
          </FormItem>

          <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_width}} label="品牌编号">
            {
              getFieldDecorator('brand_id', {
                rules: [{
                  required: true,
                  message: constant.required
                }],
                initialValue: ''
              })(
                <Select style={{
                  width: '100%'
                }} placeholder="请选择品牌">
                  {
                    this.props.brand_list.map(function (item) {
                      return (
                        <Option key={item.brand_id} value={item.brand_id}>{item.brand_name}</Option>
                      )
                    })
                  }
                </Select>
              )
            }
          </FormItem>

          <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_width}} label="商品名称">
            {
              getFieldDecorator('product_name', {
                rules: [{
                  required: true,
                  message: constant.required
                }],
                initialValue: ''
              })(
                <Input type="text" placeholder={constant.placeholder + '商品名称'}/>
              )
            }
          </FormItem>

          <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_width}} label="市场价格">
            {
              getFieldDecorator('product_market_price', {
                rules: [{
                  type: 'number'
                }],
                initialValue: 0.00
              })(
                <InputNumber type="text" className={style.formItemInput} placeholder={constant.placeholder + '市场价格'}
                             min={0} max={999999} step={0.01}/>
              )
            }
          </FormItem>

          <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_width}} label="商品价格">
            {
              getFieldDecorator('product_price', {
                rules: [{
                  type: 'number',
                  required: true,
                  message: constant.required
                }],
                initialValue: 0.00
              })(
                <InputNumber type="text" className={style.formItemInput} placeholder={constant.placeholder + '商品价格'}
                             min={0} max={999999} step={0.01}/>
              )
            }
          </FormItem>

          <FormItem hasFeedback {...constant.formItemFullLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_full_width}} label="会员价格">
            {
              this.props.member_level_list.map(function (item) {
                return (
                  <div className={style.productMemberPrice} key={item.member_level_id}>
                    <FormItem hasFeedback {...constant.formItemFullLayoutProductPrice} className={style.formItem}
                              label={item.member_level_name}
                    >
                      {
                        getFieldDecorator('product_price_list.' + item.member_level_id, {
                          rules: [{
                            type: 'number',
                            required: true,
                            message: constant.required
                          }],
                          initialValue: 0.00
                        })(
                          <InputNumber type="text" className={style.formItemInput}
                                       placeholder={constant.placeholder + '商品价格'}
                                       min={0} max={999999} step={0.01}/>
                        )
                      }
                    </FormItem>
                  </div>
                )
              })
            }
          </FormItem>

          <FormItem hasFeedback {...constant.formItemFullLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_full_width}} label="会员佣金">
            {
              this.props.member_level_list.map(function (item) {
                return (
                  <div className={style.productMemberPrice} key={item.member_level_id}>
                    <FormItem hasFeedback {...constant.formItemFullLayoutProductPrice} className={style.formItem}
                              label={item.member_level_name}
                    >
                      {
                        getFieldDecorator('product_commission_list.' + item.member_level_id, {
                          rules: [{
                            type: 'number',
                            required: true,
                            message: constant.required
                          }],
                          initialValue: 0
                        })(
                          <InputNumber type="text" className={style.formItemInput}
                                       placeholder={constant.placeholder + '商品价格'}
                                       min={0} max={100} step={1}/>
                        )
                      }
                    </FormItem>
                  </div>
                )
              })
            }
          </FormItem>

          {/*<FormItem hasFeedback {...constant.formItemFullLayoutDetail} className={style.formItem}*/}
                    {/*style={{width: constant.detail_form_item_full_width}} label="会员价格">*/}
            {/*{*/}
              {/*this.props.member_level_list.map(function (item) {*/}
                {/*return (*/}
                  {/*<div className={style.productMemberPrice} key={item.member_level_id}>*/}
                    {/*<FormItem hasFeedback {...constant.formItemFullLayoutProductPrice} className={style.formItem}*/}
                              {/*label={item.member_level_name}*/}
                    {/*>*/}
                      {/*{*/}
                        {/*getFieldDecorator('product_lr_list.' + item.member_level_id, {*/}
                          {/*rules: [{*/}
                            {/*type: 'number',*/}
                            {/*required: true,*/}
                            {/*message: constant.required*/}
                          {/*}],*/}
                          {/*initialValue: 0.00*/}
                        {/*})(*/}
                          {/*<InputNumber type="text" className={style.formItemInput}*/}
                                       {/*placeholder={constant.placeholder + '商品价格'}*/}
                                       {/*min={0} max={999999} step={0.01}/>*/}
                        {/*)*/}
                      {/*}*/}
                    {/*</FormItem>*/}
                  {/*</div>*/}
                {/*)*/}
              {/*})*/}
            {/*}*/}
          {/*</FormItem>*/}

          <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_width}} label="商品库存">
            {
              getFieldDecorator('product_stock', {
                rules: [{
                  required: true,
                  message: constant.required
                }],
                initialValue: 0
              })(
                <InputNumber type="text" className={style.formItemInput} placeholder={constant.placeholder + '商品库存'}
                             min={0} max={999}/>
              )
            }
          </FormItem>

          <FormItem hasFeedback {...constant.formItemFullLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_full_width}} label="商品标记">
            <FormItem style={{width: '70px', float: 'left'}}>
              {
                getFieldDecorator('product_is_new', {
                  valuePropName: 'checked',
                  initialValue: false
                })(
                  <Checkbox>新品</Checkbox>
                )
              }
            </FormItem>

            <FormItem style={{width: '70px', float: 'left'}}>
              {
                getFieldDecorator('product_is_recommend', {
                  valuePropName: 'checked',
                  initialValue: false
                })(
                  <Checkbox>推荐</Checkbox>
                )
              }
            </FormItem>

            <FormItem style={{width: '70px', float: 'left'}}>
              {
                getFieldDecorator('product_is_bargain', {
                  valuePropName: 'checked',
                  initialValue: false
                })(
                  <Checkbox>特价</Checkbox>
                )
              }
            </FormItem>

            <FormItem style={{width: '70px', float: 'left'}}>
              {
                getFieldDecorator('product_is_hot', {
                  valuePropName: 'checked',
                  initialValue: false
                })(
                  <Checkbox>热销</Checkbox>
                )
              }
            </FormItem>

            <FormItem style={{width: '70px', float: 'left'}}>
              {
                getFieldDecorator('product_is_sale', {
                  valuePropName: 'checked',
                  initialValue: true
                })(
                  <Checkbox>上架</Checkbox>
                )
              }
            </FormItem>
          </FormItem>

          <FormItem hasFeedback {...constant.formItemFullLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_full_width}} label="商品图片">
            <InputImage limit={1} ref="product_image"/>
          </FormItem>

          <FormItem hasFeedback {...constant.formItemFullLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_full_width}} label="图片列表">
            <InputImage limit={5} ref="product_image_list"/>
          </FormItem>

          <FormItem hasFeedback {...constant.formItemFullLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_full_width}} label="商品介绍">
            <InputHtml ref="product_content"/>
          </FormItem>

        </Spin>
      </Modal>
    );
  }
}

ProductDetail.propTypes = {
  is_load: React.PropTypes.bool.isRequired,
  is_detail: React.PropTypes.bool.isRequired,
  category_list: React.PropTypes.array.isRequired,
  brand_list: React.PropTypes.array.isRequired,
  member_level_list: React.PropTypes.array.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
  handleCancel: React.PropTypes.func.isRequired
};

ProductDetail = Form.create({
  withRef: true
})(ProductDetail);

export default ProductDetail;
