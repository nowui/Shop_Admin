import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Input, Table, Select, Popconfirm, message} from 'antd';

import ProductDetail from './ProductDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';
import style from '../style.css';


class ProductIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false
    }
  }

  componentDidMount() {
    this.props.form.setFieldsValue({
      product_name: this.props.product.product_name,
      category_id: this.props.product.category_id,
      brand_id: this.props.product.brand_id
    });

    this.handleLoad();

    this.handleCategoryList();

    this.handleBrandList();

    this.handleMemberLevelList();

    notification.on('notification_product_index_load', this, function (data) {
      this.handleLoad();
    });
  }

  componentWillUnmount() {
    notification.remove('notification_product_index_load', this);
  }

  handleCategoryList() {
    http.request({
      url: '/product/admin/category/list',
      data: {},
      success: function (json) {
        this.props.dispatch({
          type: 'product/fetch',
          data: {
            category_list: json.data
          }
        });
      }.bind(this),
      complete: function () {

      }.bind(this)
    });
  }

  handleBrandList() {
    http.request({
      url: '/brand/admin/category/list',
      data: {},
      success: function (json) {
        this.props.dispatch({
          type: 'product/fetch',
          data: {
            brand_list: json.data
          }
        });
      }.bind(this),
      complete: function () {

      }.bind(this)
    });
  }

  handleMemberLevelList() {
    http.request({
      url: '/member/level/admin/list',
      data: {
        page_index: 0,
        page_size: 0,
        member_level_name: ''
      },
      success: function (json) {
        this.props.dispatch({
          type: 'product/fetch',
          data: {
            member_level_list: json.data
          }
        });
      }.bind(this),
      complete: function () {

      }.bind(this)
    });
  }

  handleSearch() {
    new Promise(function (resolve, reject) {
      this.props.dispatch({
        type: 'product/fetch',
        data: {
          product_name: this.props.form.getFieldValue('product_name'),
          category_id: this.props.form.getFieldValue('category_id'),
          brand_id: this.props.form.getFieldValue('brand_id'),
          page_index: 1
        }
      });

      resolve();
    }.bind(this)).then(function () {
      this.handleLoad();
    }.bind(this));
  }

  handleLoad() {
    this.setState({
      is_load: true
    });

    http.request({
      url: '/product/admin/list',
      data: {
        product_name: this.props.product.product_name,
        category_id: this.props.product.category_id,
        brand_id: this.props.product.brand_id,
        page_index: this.props.product.page_index,
        page_size: this.props.product.page_size
      },
      success: function (json) {
        this.props.dispatch({
          type: 'product/fetch',
          data: {
            total: json.total,
            list: json.data
          }
        });
      }.bind(this),
      complete: function () {
        this.setState({
          is_load: false
        });
      }.bind(this)
    });
  }

  handleChangeIndex(page_index) {
    new Promise(function(resolve, reject) {
      this.props.dispatch({
        type: 'product/fetch',
        data: {
          page_index: page_index
        }
      });

      resolve();
    }.bind(this)).then(function() {
      this.handleLoad();
    }.bind(this));
  }

  handleChangeSize(page_index, page_size) {
    new Promise(function(resolve, reject) {
      this.props.dispatch({
        type: 'product/fetch',
        data: {
          page_index: page_index,
          page_size: page_size
        }
      });

      resolve();
    }.bind(this)).then(function() {
      this.handleLoad();
    }.bind(this));
  }

  handleSave() {
    notification.emit('notification_product_detail_save', {});
  }

  handleUpdate(product_id) {
    notification.emit('notification_product_detail_update', {
      product_id: product_id
    });
  }

  handleDelete(product_id) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    http.request({
      url: '/product/admin/delete',
      data: {
        product_id: product_id
      },
      success: function (json) {
        message.success(constant.success);

        this.handleLoad();
      }.bind(this),
      complete: function () {

      }.bind(this)
    });
  }

  render() {
    const FormItem = Form.Item;
    const Option = Select.Option;
    const {getFieldDecorator} = this.props.form;

    const columns = [{
      title: '名称',
      dataIndex: 'product_name'
    }, {
      width: 90,
      title: '价格',
      dataIndex: 'product_price'
    }, {
      width: 90,
      title: constant.action,
      dataIndex: '',
      render: (text, record, index) => (
        <span>
          <a onClick={this.handleUpdate.bind(this, record.product_id)}>{constant.update}</a>
          <span className={style.divider}/>
          <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                      cancelText={constant.popconfirm_cancel}
                      onConfirm={this.handleDelete.bind(this, record.product_id)}>
            <a>{constant.delete}</a>
          </Popconfirm>
        </span>
      )
    }];

    const pagination = {
      size: 'defalut',
      total: this.props.product.total,
      showTotal: function (total, range) {
        return '总共' + total + '条数据';
      },
      current: this.props.product.page_index,
      pageSize: this.props.product.page_size,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize.bind(this),
      onChange: this.handleChangeIndex.bind(this)
    };

    return (
      <QueueAnim>
        <div key="0">
          <Row className={style.layoutContentHeader}>
            <Col span={8}>
              <div className={style.layoutContentHeaderTitle}>商品列表</div>
            </Col>
            <Col span={16} className={style.layoutContentHeaderMenu}>
              <Button type="default" icon="search" size="default" className={style.layoutContentHeaderMenuButton}
                      loading={this.state.is_load}
                      onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
              <Button type="primary" icon="plus-circle" size="default"
                      onClick={this.handleSave.bind(this)}>{constant.save}</Button>
            </Col>
          </Row>
          <Form className={style.layoutContentHeaderSearch}>
            <Row>
              <Col span={8}>
                <FormItem hasFeedback {...constant.formItemLayout} className={style.formSearchItem} label="名称">
                  {
                    getFieldDecorator('product_name', {
                      initialValue: ''
                    })(
                      <Input type="text" placeholder="请输入名称" className={style.formItemInput}/>
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem hasFeedback {...constant.formItemLayout} className={style.formSearchItem} label="分类">
                  {
                    getFieldDecorator('category_id', {
                      initialValue: ''
                    })(
                      <Select allowClear placeholder="请选择分类" className={style.formItemInput}>
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
              </Col>
              <Col span={8}>
                <FormItem hasFeedback {...constant.formItemLayout} className={style.formSearchItem} label="品牌">
                  {
                    getFieldDecorator('brand_id', {
                      initialValue: ''
                    })(
                      <Select allowClear placeholder="请选择品牌" className={style.formItemInput}>
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
              </Col>
            </Row>
          </Form>
          <Table rowKey="product_id"
                 className={style.layoutContentHeaderTable}
                 loading={this.state.is_load} columns={columns}
                 dataSource={this.props.product.list} pagination={pagination}
                 bordered/>
          <ProductDetail/>
        </div>
      </QueueAnim>
    );
  }
}

ProductIndex.propTypes = {};

ProductIndex = Form.create({})(ProductIndex);

export default connect(({product}) => ({
  product
}))(ProductIndex);
