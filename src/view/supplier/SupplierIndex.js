import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Input, Table, Popconfirm, message} from 'antd';

import SupplierDetail from './SupplierDetail';
import constant from '../../util/constant';
import http from '../../util/http';
import style from '../style.css';

let request;

class SupplierIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {
    this.handleSearch();
  }

  componentWillUnmount() {
    this.handleReset();
  }

  handleSearch() {
    let supplier_name = this.props.form.getFieldValue('supplier_name');
    let page_index = 1;

    this.handleList(supplier_name, page_index);
  }

  handleLoad(page_index) {
    let supplier_name = this.props.supplier.supplier_name;

    this.handleList(supplier_name, page_index);
  }

  handleList(supplier_name, page_index) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request = http({
      url: '/supplier/admin/list',
      data: {
        supplier_name: supplier_name,
        page_index: page_index,
        page_size: this.props.supplier.page_size
      },
      success: function (json) {
        for (let i = 0; i < json.data.length; i++) {
          json.data[i].key = json.data[i].supplier_id;
        }

        this.props.dispatch({
          type: 'supplier/fetch',
          data: {
            supplier_name: supplier_name,
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
      type: 'supplier/fetch',
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
      type: 'supplier/fetch',
      data: {
        is_detail: true,
        action: 'save'
      }
    });
  }

  handleUpdate(supplier_id) {
    if (this.handleStart({
        is_load: true,
        is_detail: true,
        action: 'update',
        supplier_id: supplier_id
      })) {
      return;
    }

    request = http({
      url: '/supplier/admin/find',
      data: {
        supplier_id: supplier_id
      },
      success: function (json) {
        this.refs.detail.setFieldsValue(json.data);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleDelete(supplier_id) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request = http({
      url: '/supplier/delete',
      data: {
        supplier_id: supplier_id
      },
      success: function (json) {
        message.success(constant.success);

        setTimeout(function () {
          this.handleLoad(this.props.supplier.page_index);
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

    if (this.props.supplier.action == 'update') {
      data.supplier_id = this.props.supplier.supplier_id;
    }

    request = http({
      url: '/supplier/' + this.props.supplier.action,
      data: data,
      success: function (json) {
        message.success(constant.success);

        this.handleCancel();

        setTimeout(function () {
          this.handleLoad(this.props.supplier.page_index);
        }.bind(this), constant.timeout);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleCancel() {
    this.props.dispatch({
      type: 'supplier/fetch',
      data: {
        is_detail: false
      }
    });

    this.refs.detail.refs.wrappedComponent.refs.formWrappedComponent.handleReset();
  }

  handleStart(data) {
    if (this.props.supplier.is_load) {
      return true;
    }

    this.props.dispatch({
      type: 'supplier/fetch',
      data: data
    });

    return false;
  }

  handleFinish() {
    this.props.dispatch({
      type: 'supplier/fetch',
      data: {
        is_load: false
      }
    });
  }

  handleReset() {
    request.cancel();

    this.props.dispatch({
      type: 'supplier/fetch',
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
      dataIndex: 'supplier_name'
    }, {
      width: 90,
      title: constant.action,
      dataIndex: '',
      render: (text, record, index) => (
        <span>
          <a onClick={this.handleUpdate.bind(this, record.supplier_id)}>{constant.update}</a>
          <span className={style.divider}/>
          <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                      cancelText={constant.popconfirm_cancel}
                      onConfirm={this.handleDelete.bind(this, record.supplier_id)}>
            <a>{constant.delete}</a>
          </Popconfirm>
        </span>
      )
    }];

    const pagination = {
      size: 'defalut',
      total: this.props.supplier.total,
      current: this.props.supplier.page_index,
      showTotal: function (total, range) {
        return '总共' + total + '条数据';
      },
      pageSize: this.props.supplier.page_size,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize.bind(this),
      onChange: this.handleLoad.bind(this)
    };

    return (
      <QueueAnim>
        <div key="0">
          <Row className={style.layoutContentHeader}>
            <Col span={8}>
              <div className={style.layoutContentHeaderTitle}>供应商列表</div>
            </Col>
            <Col span={16} className={style.layoutContentHeaderMenu}>
              <Button type="default" icon="search" size="default" className={style.layoutContentHeaderMenuButton}
                      loading={this.props.supplier.is_load}
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
                    getFieldDecorator('supplier_name', {
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
                 loading={this.props.supplier.is_load && !this.props.supplier.is_detail} columns={columns}
                 dataSource={this.props.supplier.list} pagination={pagination} scroll={{y: constant.scrollHeight()}}
                 bordered/>
          <SupplierDetail is_load={this.props.supplier.is_load}
                          is_detail={this.props.supplier.is_detail}
                          action={this.props.supplier.action}
                          handleSubmit={this.handleSubmit.bind(this)}
                          handleCancel={this.handleCancel.bind(this)}
                          ref="detail"/>
        </div>
      </QueueAnim>
    );
  }
}

SupplierIndex.propTypes = {};

SupplierIndex = Form.create({})(SupplierIndex);

export default connect(({supplier}) => ({
  supplier,
}))(SupplierIndex);
