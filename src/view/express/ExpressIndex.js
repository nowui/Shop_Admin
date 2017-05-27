import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Input, Table, Popconfirm, message} from 'antd';

import ExpressDetail from './ExpressDetail';
import constant from '../../util/constant';
import request from '../../util/request';
import style from '../style.css';


class ExpressIndex extends Component {
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
    let express_name = this.props.form.getFieldValue('express_name');
    let page_index = 1;

    this.handleList(express_name, page_index);
  }

  handleLoad(page_index) {
    let express_name = this.props.express.express_name;

    this.handleList(express_name, page_index);
  }

  handleList(express_name, page_index) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request.post({
      url: '/express/admin/list',
      data: {
        express_name: express_name,
        page_index: page_index,
        page_size: this.props.express.page_size
      },
      success: function (json) {
        for (let i = 0; i < json.data.length; i++) {
          json.data[i].key = json.data[i].express_id;
        }

        this.props.dispatch({
          type: 'express/fetch',
          data: {
            express_name: express_name,
            total: json.total,
            list: json.data,
            page_index: page_index
          }
        });
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    });
  }

  handleChangeSize(page_index, page_size) {
    this.props.dispatch({
      type: 'express/fetch',
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
      type: 'express/fetch',
      data: {
        is_detail: true,
        action: 'save'
      }
    });
  }

  handleUpdate(express_id) {
    if (this.handleStart({
        is_load: true,
        is_detail: true,
        action: 'update',
        express_id: express_id
      })) {
      return;
    }

    request.post({
      url: '/express/admin/find',
      data: {
        express_id: express_id
      },
      success: function (json) {
        this.refs.detail.setFieldsValue(json.data);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    });
  }

  handleDelete(express_id) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request.post({
      url: '/express/delete',
      data: {
        express_id: express_id
      },
      success: function (json) {
        message.success(constant.success);

        setTimeout(function () {
            this.handleLoad(this.props.express.page_index);
        }.bind(this), constant.timeout);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    });
  }

  handleSubmit(data) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    if (this.props.express.action == 'update') {
      data.express_id = this.props.express.express_id;
    }

    request.post({
      url: '/express/' + this.props.express.action,
      data: data,
      success: function (json) {
        message.success(constant.success);

        this.handleCancel();

        setTimeout(function () {
            this.handleLoad(this.props.express.page_index);
        }.bind(this), constant.timeout);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    });
  }

  handleCancel() {
    this.props.dispatch({
      type: 'express/fetch',
      data: {
        is_detail: false
      }
    });

    this.refs.detail.refs.wrappedComponent.refs.formWrappedComponent.handleReset();
  }

  handleStart(data) {
    if (this.props.express.is_load) {
      return true;
    }

    this.props.dispatch({
      type: 'express/fetch',
      data: data
    });

    return false;
  }

  handleFinish() {
    this.props.dispatch({
      type: 'express/fetch',
      data: {
        is_load: false
      }
    });
  }

  handleReset() {

    this.props.dispatch({
      type: 'express/fetch',
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
      dataIndex: 'express_name'
    }, {
      width: 90,
      title: constant.action,
      dataIndex: '',
      render: (text, record, index) => (
        <span>
          <a onClick={this.handleUpdate.bind(this, record.express_id)}>{constant.update}</a>
          <span className={style.divider}/>
          <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                      cancelText={constant.popconfirm_cancel} onConfirm={this.handleDelete.bind(this, record.express_id)}>
            <a>{constant.delete}</a>
          </Popconfirm>
        </span>
      )
    }];

    const pagination = {
      total: this.props.express.total,
      current: this.props.express.page_index,
      pageSize: this.props.express.page_size,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize.bind(this),
      onChange: this.handleLoad.bind(this)
    };

    return (
      <QueueAnim>
        <div key="0">
          <Row className={style.layoutContentHeader}>
            <Col span={8}>
              <div className={style.layoutContentHeaderTitle}>列表</div>
            </Col>
            <Col span={16} className={style.layoutContentHeaderMenu}>
              <Button type="default" icon="search" size="default" className={style.layoutContentHeaderMenuButton}
                      loading={this.props.express.is_load}
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
                    getFieldDecorator('express_name', {
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
                 loading={this.props.express.is_load && !this.props.express.is_detail} columns={columns}
                 dataSource={this.props.express.list} pagination={pagination}
                 bordered/>
          <ExpressDetail is_load={this.props.express.is_load}
                      is_detail={this.props.express.is_detail}
                      handleSubmit={this.handleSubmit.bind(this)}
                      handleCancel={this.handleCancel.bind(this)}
                      ref="detail"/>
        </div>
      </QueueAnim>
    );
  }
}

ExpressIndex.propTypes = {};

ExpressIndex = Form.create({})(ExpressIndex);

export default connect(({express}) => ({
  express,
}))(ExpressIndex);
