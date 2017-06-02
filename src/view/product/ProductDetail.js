import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Spin, Button, Input, InputNumber, Checkbox, Select, message} from 'antd';
import InputImage from '../../component/InputImage';
import InputHtml from '../../component/InputHtml';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';
import style from '../style.css';

class ProductDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false,
      is_show: false,
      action: '',
      product_id: '',
      income: ''
    }
  }

  componentDidMount() {
    notification.on('notification_product_detail_save', this, function (data) {
      this.setState({
        is_show: true,
        action: 'save'
      });
    });

    notification.on('notification_product_detail_update', this, function (data) {
      this.setState({
        is_show: true,
        action: 'update',
        product_id: data.product_id
      });

      setTimeout(function () {
        this.handleLoad(data.product_id);
      }.bind(this), 200);
    });
  }

  componentWillUnmount() {
    notification.remove('notification_product_detail_save', this);

    notification.remove('notification_product_detail_update', this);
  }

  handleLoad(product_id) {
    this.setState({
      is_load: true
    });

    http.request({
      url: '/product/admin/find',
      data: {
        product_id: product_id
      },
      success: function (json) {
        this.props.form.setFieldsValue({
          category_id: json.data.category_id,
          brand_id: json.data.brand_id,
          product_name: json.data.product_name,
          product_market_price: json.data.product_market_price,
          product_price: json.data.product_price,
          product_stock: json.data.product_stock
        });

        var sku_list = json.data.sku_list;

        for (var i = 0; i < sku_list.length; i++) {
          var sku = sku_list[i];

          if (sku.product_attribute = '[]') {
            var product_price = JSON.parse(sku.product_price);
            for (var j = 0; j < product_price.length; j++) {
              if (product_price[j].member_level_id != '') {
                var object = {};
                object['product_price_list_' + product_price[j].member_level_id] = product_price[j].product_price;
                this.props.form.setFieldsValue(object);
              }
            }
          }
        }

        this.setState({
          income: json.data.income
        });

        if (json.data.income == 'commission') {
          var commission_list = json.data.commission_list;

          for (var i = 0; i < commission_list.length; i++) {
            var commission = commission_list[i];

            if (commission.product_attribute = '[]') {
              var product_commission = JSON.parse(commission.product_commission);
              for (var j = 0; j < product_commission.length; j++) {
                if (product_price[j].member_level_id != '') {
                  var object = {};
                  object['product_commission_list_' + product_commission[j].member_level_id] = product_commission[j].product_commission;
                  this.props.form.setFieldsValue(object);
                }
              }
            }
          }
        }

        this.refs.product_image.handleSetValue([json.data.product_image_file]);

        var product_image_list = [];
        for (var i = 0; i < json.data.product_image_file_list.length; i++) {
          product_image_list.push(json.data.product_image_file_list[i]);
        }
        this.refs.product_image_list.handleSetValue(product_image_list);

        this.refs.product_content.handleSetValue(json.data.product_content);
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

      values.product_id = this.state.product_id;

      var product_image_file = this.refs.product_image.handleGetValue();
      if (product_image_file.length == 0) {
        message.error('商品图片不能为空');

        return;
      }
      values.product_image = product_image_file[0].file_id;

      var product_image_file_list = this.refs.product_image_list.handleGetValue();
      var product_image_list = [];
      for (var i = 0; i < product_image_file_list.length; i++) {
        product_image_list.push(product_image_file_list[i].file_id);
      }
      values.product_image_list = JSON.stringify(product_image_list);

      values.product_content = this.refs.product_content.handleGetValue();

      var sku_list = [];
      var product_price = [];

      product_price.push({
        member_level_id: '',
        member_level_name: '',
        product_price: values.product_price
      });

      for (var i = 0; i < this.props.product.member_level_list.length; i++) {
        product_price.push({
          member_level_id: this.props.product.member_level_list[i].member_level_id,
          member_level_name: this.props.product.member_level_list[i].member_level_name,
          product_price: this.props.form.getFieldValue('product_price_list_' + this.props.product.member_level_list[i].member_level_id)
        });
      }

      delete values.product_price_list;

      sku_list.push({
        product_attribute: JSON.stringify([]),
        product_price: JSON.stringify(product_price),
        product_stock: values.product_stock
      });

      values.sku_list = sku_list;

      var commission_list = [];
      var product_commission = [];

      if (this.state.income == 'commission') {
        product_commission.push({
          member_level_id: '',
          member_level_name: '',
          product_commission: values.product_commission
        });

        for (var i = 0; i < this.props.product.member_level_list.length; i++) {
          product_commission.push({
            member_level_id: this.props.product.member_level_list[i].member_level_id,
            member_level_name: this.props.product.member_level_list[i].member_level_name,
            product_commission: this.props.form.getFieldValue('product_commission_list_' + this.props.product.member_level_list[i].member_level_id)
          });
        }
      }

      commission_list.push({
        product_attribute: JSON.stringify([]),
        product_commission: JSON.stringify(product_commission)
      });

      values.commission_list = commission_list;

      this.setState({
        is_load: true
      });

      http.request({
        url: '/product/admin/' + this.state.action,
        data: values,
        success: function (json) {
          message.success(constant.success);

          this.handleCancel();

          notification.emit('notification_product_index_load', {});
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
          <Form>
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
                  <Select className={style.formItemInput} placeholder="请选择分类">
                    {
                      this.props.product.category_list.map(function (item) {
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
                  <Select className={style.formItemInput} placeholder="请选择品牌">
                    {
                      this.props.product.brand_list.map(function (item) {
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
                this.props.product.member_level_list.map(function (item) {
                  return (
                    <div className={style.productMemberPrice} key={item.member_level_id}>
                      <FormItem hasFeedback {...constant.formItemFullLayoutProductPrice} className={style.formItem}
                                label={item.member_level_name + '(¥)'}
                      >
                        {
                          getFieldDecorator('product_price_list_' + item.member_level_id, {
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

            {
              this.state.income == 'commission' ?
                <FormItem hasFeedback {...constant.formItemFullLayoutDetail} className={style.formItem}
                          style={{width: constant.detail_form_item_full_width}} label="会员佣金">
                  {
                    this.props.product.member_level_list.map(function (item) {
                      return (
                        <div className={style.productMemberPrice} key={item.member_level_id}>
                          <FormItem hasFeedback {...constant.formItemFullLayoutProductPrice} className={style.formItem}
                                    label={item.member_level_name + '(%)'}
                          >
                            {
                              getFieldDecorator('product_commission_list_' + item.member_level_id, {
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
                :
                ''
            }

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
              <InputImage name="product_image" limit={1} ref="product_image"/>
            </FormItem>

            <FormItem hasFeedback {...constant.formItemFullLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_full_width}} label="图片列表">
              <InputImage name="product_image_list" limit={5} ref="product_image_list"/>
            </FormItem>

            <FormItem hasFeedback {...constant.formItemFullLayoutDetail} className={style.formItem}
                      style={{width: constant.detail_form_item_full_width}} label="商品介绍">
              <InputHtml name="product_content" ref="product_content"/>
            </FormItem>

          </Form>
        </Spin>
      </Modal>
    );
  }
}

ProductDetail.propTypes = {};

ProductDetail = Form.create({})(ProductDetail);

export default connect(({product}) => ({
  product
}))(ProductDetail);
