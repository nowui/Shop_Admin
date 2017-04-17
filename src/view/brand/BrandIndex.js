import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Input, Table, Popconfirm, message} from 'antd';

import BrandDetail from './BrandDetail';
import constant from '../../util/constant';
import http from '../../util/http';
import style from '../style.css';

let request;

class BrandIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {
    this.props.form.setFieldsValue(this.props.brand);

    this.handleSearch();
  }

  componentWillUnmount() {
    this.handleReset();
  }

  handleSearch() {
    let brand_name = this.props.form.getFieldValue('brand_name');
    let page_index = 1;

    this.handleList(brand_name, page_index);
  }

  handleLoad(page_index) {
    let brand_name = this.props.brand.brand_name;

    this.handleList(brand_name, page_index);
  }

  handleList(brand_name, page_index) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request = http({
      url: '/brand/admin/list',
      data: {
        brand_name: brand_name,
        page_index: page_index,
        page_size: this.props.brand.page_size
      },
      success: function (json) {
        for (let i = 0; i < json.data.length; i++) {
          json.data[i].key = json.data[i].brand_id;
        }

        this.props.dispatch({
          type: 'brand/fetch',
          data: {
            brand_name: brand_name,
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
      type: 'brand/fetch',
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
      type: 'brand/fetch',
      data: {
        is_detail: true,
        action: 'save'
      }
    });
  }

  handleUpdate(brand_id) {
    if (this.handleStart({
        is_load: true,
        is_detail: true,
        action: 'update',
        brand_id: brand_id
      })) {
      return;
    }

    request = http({
      url: '/brand/admin/find',
      data: {
        brand_id: brand_id
      },
      success: function (json) {
        this.refs.detail.refs.wrappedComponent.refs.formWrappedComponent.handleSetFieldsValue(json.data);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleDelete(brand_id) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request = http({
      url: '/brand/delete',
      data: {
        brand_id: brand_id
      },
      success: function (json) {
        message.success(constant.success);

        setTimeout(function () {
            this.handleLoad(this.props.brand.page_index);
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

    if (this.props.brand.action == 'update') {
      data.brand_id = this.props.brand.brand_id;
    }

    request = http({
      url: '/brand/' + this.props.brand.action,
      data: data,
      success: function (json) {
        message.success(constant.success);

        this.handleCancel();

        setTimeout(function () {
            this.handleLoad(this.props.brand.page_index);
        }.bind(this), constant.timeout);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleCancel() {
    this.props.dispatch({
      type: 'brand/fetch',
      data: {
        is_detail: false
      }
    });

    this.refs.detail.refs.wrappedComponent.refs.formWrappedComponent.handleReset();
  }

  handleStart(data) {
    if (this.props.brand.is_load) {
      return true;
    }

    this.props.dispatch({
      type: 'brand/fetch',
      data: data
    });

    return false;
  }

  handleFinish() {
    this.props.dispatch({
      type: 'brand/fetch',
      data: {
        is_load: false
      }
    });
  }

  handleReset() {
    request.cancel();

    this.props.dispatch({
      type: 'brand/fetch',
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
      dataIndex: 'brand_name'
    }, {
      width: 90,
      title: constant.action,
      dataIndex: '',
      render: (text, record, index) => (
        <span>
          <a onClick={this.handleUpdate.bind(this, record.brand_id)}>{constant.update}</a>
          <span className={style.divider}/>
          <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                      cancelText={constant.popconfirm_cancel} onConfirm={this.handleDelete.bind(this, record.brand_id)}>
            <a>{constant.delete}</a>
          </Popconfirm>
        </span>
      )
    }];

    const pagination = {
      total: this.props.brand.total,
      current: this.props.brand.page_index,
      pageSize: this.props.brand.page_size,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize.bind(this),
      onChange: this.handleLoad.bind(this)
    };

    return (
      <QueueAnim>
        <div key="0">
          <Row className={style.layoutContentHeader}>
            <Col span={8}>
              <div className={style.layoutContentHeaderTitle}>品牌列表</div>
            </Col>
            <Col span={16} className={style.layoutContentHeaderMenu}>
              <Button type="default" icon="search" size="default" className={style.layoutContentHeaderMenuButton}
                      loading={this.props.brand.is_load}
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
                    getFieldDecorator('brand_name', {
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
          <Table className={style.layoutContentHeaderTable}
                 loading={this.props.brand.is_load && !this.props.brand.is_detail} columns={columns}
                 dataSource={this.props.brand.list} pagination={pagination} scroll={{y: constant.scrollHeight()}}
                 bordered/>
          <BrandDetail is_load={this.props.brand.is_load}
                      is_detail={this.props.brand.is_detail}
                      handleSubmit={this.handleSubmit.bind(this)}
                      handleCancel={this.handleCancel.bind(this)}
                      ref="detail"/>
        </div>
      </QueueAnim>
    );
  }
}

BrandIndex.propTypes = {};

BrandIndex = Form.create({})(BrandIndex);

export default connect(({brand}) => ({
  brand,
}))(BrandIndex);
