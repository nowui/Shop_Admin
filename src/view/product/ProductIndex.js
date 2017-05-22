import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Input, Table, Popconfirm, message} from 'antd';

import ProductDetail from './ProductDetail';
import constant from '../../util/constant';
import http from '../../util/http';
import style from '../style.css';

let request;

class ProductIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      category_list: [],
      brand_list: [],
      member_level_list: []
    }
  }

  componentDidMount() {
    this.props.form.setFieldsValue(this.props.product);

    this.handleSearch();

    this.handleCategoryList();

    this.handleBrandList();

    this.handleMemberLevelList();
  }

  componentWillUnmount() {
    this.handleReset();
  }

  handleCategoryList() {
    http({
      url: '/product/category/list',
      data: {},
      success: function (json) {
        this.setState({
          category_list: json.data
        });
      }.bind(this),
      complete: function () {

      }.bind(this)
    }).post();
  }

  handleBrandList() {
    http({
      url: '/brand/category/list',
      data: {},
      success: function (json) {
        this.setState({
          brand_list: json.data
        });
      }.bind(this),
      complete: function () {

      }.bind(this)
    }).post();
  }

  handleMemberLevelList() {
    http({
      url: '/member/level/category/list',
      data: {},
      success: function (json) {
        this.setState({
          member_level_list: json.data
        });
      }.bind(this),
      complete: function () {

      }.bind(this)
    }).post();
  }

  handleSearch() {
    let product_name = this.props.form.getFieldValue('product_name');
    let page_index = 1;

    this.handleList(product_name, page_index);
  }

  handleLoad(page_index) {
    let product_name = this.props.product.product_name;

    this.handleList(product_name, page_index);
  }

  handleList(product_name, page_index) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request = http({
      url: '/product/admin/list',
      data: {
        product_name: product_name,
        page_index: page_index,
        page_size: this.props.product.page_size
      },
      success: function (json) {
        for (let i = 0; i < json.data.length; i++) {
          json.data[i].key = json.data[i].product_id;
        }

        this.props.dispatch({
          type: 'product/fetch',
          data: {
            product_name: product_name,
            total: json.total,
            list: json.data,
            page_index: page_index
          }
        });
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleChangeSize(page_index, page_size) {
    this.props.dispatch({
      type: 'product/fetch',
      data: {
        page_size: page_size
      }
    });

    setTimeout(function () {
      this.handleLoad(page_index);
    }.bind(this), constant.timeout);
  }

  handleSave() {
    this.props.dispatch({
      type: 'product/fetch',
      data: {
        is_detail: true,
        action: 'save'
      }
    });
  }

  handleUpdate(product_id) {
    if (this.handleStart({
        is_load: true,
        is_detail: true,
        action: 'update',
        product_id: product_id
      })) {
      return;
    }

    request = http({
      url: '/product/admin/find',
      data: {
        product_id: product_id
      },
      success: function (json) {
        this.refs.detail.refs.wrappedComponent.refs.formWrappedComponent.handleSetFieldsValue(json.data);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleDelete(product_id) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request = http({
      url: '/product/delete',
      data: {
        product_id: product_id
      },
      success: function (json) {
        message.success(constant.success);

        setTimeout(function () {
          this.handleLoad(this.props.product.page_index);
        }.bind(this), constant.timeout);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleSubmit(data) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    if (this.props.product.action == 'update') {
      data.product_id = this.props.product.product_id;
    }

    request = http({
      url: '/product/' + this.props.product.action,
      data: data,
      success: function (json) {
        message.success(constant.success);

        this.handleCancel();

        setTimeout(function () {
          this.handleLoad(this.props.product.page_index);
        }.bind(this), constant.timeout);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleCancel() {
    this.props.dispatch({
      type: 'product/fetch',
      data: {
        is_detail: false
      }
    });

    this.refs.detail.refs.wrappedComponent.refs.formWrappedComponent.handleReset();
  }

  handleStart(data) {
    if (this.props.product.is_load) {
      return true;
    }

    this.props.dispatch({
      type: 'product/fetch',
      data: data
    });

    return false;
  }

  handleFinish() {
    this.props.dispatch({
      type: 'product/fetch',
      data: {
        is_load: false
      }
    });
  }

  handleReset() {
    request.cancel();

    this.props.dispatch({
      type: 'product/fetch',
      data: {
        is_detail: false
      }
    });
  }

  render() {
    const FormItem = Form.Item;
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
      onChange: this.handleLoad.bind(this)
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
                      loading={this.props.product.is_load}
                      onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
              <Button type="primary" icon="plus-circle" size="default"
                      onClick={this.handleSave.bind(this)}>{constant.save}</Button>
            </Col>
          </Row>
          <Form className={style.layoutContentHeaderSearch}>
            <Row>
              <Col span={8}>
                <FormItem hasFeedback {...constant.formItemLayout} className={style.formItem} label="名称">
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
              </Col>
              <Col span={8}>
              </Col>
            </Row>
          </Form>
          <Table size="middle" className={style.layoutContentHeaderTable}
                 loading={this.props.product.is_load && !this.props.product.is_detail} columns={columns}
                 dataSource={this.props.product.list} pagination={pagination} scroll={{y: constant.scrollHeight()}}
                 bordered/>
          <ProductDetail is_load={this.props.product.is_load}
                         is_detail={this.props.product.is_detail}
                         category_list={this.state.category_list}
                         brand_list={this.state.brand_list}
                         member_level_list={this.state.member_level_list}
                         handleSubmit={this.handleSubmit.bind(this)}
                         handleCancel={this.handleCancel.bind(this)}
                         ref="detail"/>
        </div>
      </QueueAnim>
    );
  }
}

ProductIndex.propTypes = {};

ProductIndex = Form.create({})(ProductIndex);

export default connect(({product}) => ({
  product,
}))(ProductIndex);
