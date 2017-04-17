import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Input, Table, Popconfirm, message} from 'antd';

import DistributorDetail from './DistributorDetail';
import constant from '../../util/constant';
import http from '../../util/http';
import style from '../style.css';

let request;

class DistributorIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {
    this.props.form.setFieldsValue(this.props.distributor);

    this.handleSearch();
  }

  componentWillUnmount() {
    this.handleReset();
  }

  handleSearch() {
    let distributor_name = this.props.form.getFieldValue('distributor_name');
    let page_index = 1;

    this.handleList(distributor_name, page_index);
  }

  handleLoad(page_index) {
    let distributor_name = this.props.distributor.distributor_name;

    this.handleList(distributor_name, page_index);
  }

  handleList(distributor_name, page_index) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request = http({
      url: '/distributor/admin/list',
      data: {
        distributor_name: distributor_name,
        page_index: page_index,
        page_size: this.props.distributor.page_size
      },
      success: function (json) {
        for (let i = 0; i < json.data.length; i++) {
          json.data[i].key = json.data[i].distributor_id;
        }

        this.props.dispatch({
          type: 'distributor/fetch',
          data: {
            distributor_name: distributor_name,
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
      type: 'distributor/fetch',
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
      type: 'distributor/fetch',
      data: {
        is_detail: true,
        action: 'save'
      }
    });
  }

  handleUpdate(distributor_id) {
    if (this.handleStart({
        is_load: true,
        is_detail: true,
        action: 'update',
        distributor_id: distributor_id
      })) {
      return;
    }

    request = http({
      url: '/distributor/admin/find',
      data: {
        distributor_id: distributor_id
      },
      success: function (json) {
        this.refs.detail.refs.wrappedComponent.refs.formWrappedComponent.handleSetFieldsValue(json.data);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleDelete(distributor_id) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request = http({
      url: '/distributor/delete',
      data: {
        distributor_id: distributor_id
      },
      success: function (json) {
        message.success(constant.success);

        setTimeout(function () {
          this.handleLoad(this.props.distributor.page_index);
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

    if (this.props.distributor.action == 'update') {
      data.distributor_id = this.props.distributor.distributor_id;
    }

    request = http({
      url: '/distributor/' + this.props.distributor.action,
      data: data,
      success: function (json) {
        message.success(constant.success);

        this.handleCancel();

        setTimeout(function () {
          this.handleLoad(this.props.distributor.page_index);
        }.bind(this), constant.timeout);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleCancel() {
    this.props.dispatch({
      type: 'distributor/fetch',
      data: {
        is_detail: false
      }
    });

    this.refs.detail.refs.wrappedComponent.refs.formWrappedComponent.handleReset();
  }

  handleStart(data) {
    if (this.props.distributor.is_load) {
      return true;
    }

    this.props.dispatch({
      type: 'distributor/fetch',
      data: data
    });

    return false;
  }

  handleFinish() {
    this.props.dispatch({
      type: 'distributor/fetch',
      data: {
        is_load: false
      }
    });
  }

  handleReset() {
    request.cancel();

    this.props.dispatch({
      type: 'distributor/fetch',
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
      dataIndex: 'distributor_name'
    }, {
      width: 90,
      title: constant.action,
      dataIndex: '',
      render: (text, record, index) => (
        <span>
          <a onClick={this.handleUpdate.bind(this, record.distributor_id)}>{constant.update}</a>
          <span className={style.divider}/>
          <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                      cancelText={constant.popconfirm_cancel}
                      onConfirm={this.handleDelete.bind(this, record.distributor_id)}>
            <a>{constant.delete}</a>
          </Popconfirm>
        </span>
      )
    }];

    const pagination = {
      total: this.props.distributor.total,
      current: this.props.distributor.page_index,
      pageSize: this.props.distributor.page_size,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize.bind(this),
      onChange: this.handleLoad.bind(this)
    };

    return (
      <QueueAnim>
        <div key="0">
          <Row className={style.layoutContentHeader}>
            <Col span={8}>
              <div className={style.layoutContentHeaderTitle}>经销商列表</div>
            </Col>
            <Col span={16} className={style.layoutContentHeaderMenu}>
              <Button type="default" icon="search" size="default" className={style.layoutContentHeaderMenuButton}
                      loading={this.props.distributor.is_load}
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
                    getFieldDecorator('distributor_name', {
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
                 loading={this.props.distributor.is_load && !this.props.distributor.is_detail} columns={columns}
                 dataSource={this.props.distributor.list} pagination={pagination} scroll={{y: constant.scrollHeight()}}
                 bordered/>
          <DistributorDetail is_load={this.props.distributor.is_load}
                             is_detail={this.props.distributor.is_detail}
                             action={this.props.distributor.action}
                             handleSubmit={this.handleSubmit.bind(this)}
                             handleCancel={this.handleCancel.bind(this)}
                             ref="detail"/>
        </div>
      </QueueAnim>
    );
  }
}

DistributorIndex.propTypes = {};

DistributorIndex = Form.create({})(DistributorIndex);

export default connect(({distributor}) => ({
  distributor,
}))(DistributorIndex);
