import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Input, Table, Popconfirm, message} from 'antd';

import ClazzDetail from './ClazzDetail';
import constant from '../../constant/constant';
import http from '../../util/http';
import style from '../style.css';

let request;

class ClazzIndex extends Component {
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
    let clazz_name = this.props.form.getFieldValue('clazz_name');
    let page_index = 1;

    this.handleList(clazz_name, page_index);
  }

  handleLoad(page_index) {
    let clazz_name = this.props.clazz.clazz_name;

    this.handleList(clazz_name, page_index);
  }

  handleList(clazz_name, page_index) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request = http({
      url: '/clazz/admin/list',
      data: {
        clazz_name: clazz_name,
        page_index: page_index,
        page_size: this.props.clazz.page_size
      },
      success: function (json) {
        for (let i = 0; i < json.data.length; i++) {
          json.data[i].key = json.data[i].clazz_id;
        }

        this.props.dispatch({
          type: 'clazz/fetch',
          data: {
            clazz_name: clazz_name,
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
      type: 'clazz/fetch',
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
      type: 'clazz/fetch',
      data: {
        is_detail: true,
        action: 'save'
      }
    });
  }

  handleUpdate(clazz_id) {
    if (this.handleStart({
        is_load: true,
        is_detail: true,
        action: 'update',
        clazz_id: clazz_id
      })) {
      return;
    }

    request = http({
      url: '/clazz/admin/find',
      data: {
        clazz_id: clazz_id
      },
      success: function (json) {
        this.refs.detail.setFieldsValue(json.data);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleDelete(clazz_id) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request = http({
      url: '/clazz/delete',
      data: {
        clazz_id: clazz_id
      },
      success: function (json) {
        message.success(constant.success);

        setTimeout(function () {
            this.handleLoad(this.props.clazz.page_index);
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

    if (this.props.clazz.action == 'update') {
      data.clazz_id = this.props.clazz.clazz_id;
    }

    request = http({
      url: '/clazz/' + this.props.clazz.action,
      data: data,
      success: function (json) {
        message.success(constant.success);

        this.handleCancel();

        setTimeout(function () {
            this.handleLoad(this.props.clazz.page_index);
        }.bind(this), constant.timeout);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleCancel() {
    this.props.dispatch({
      type: 'clazz/fetch',
      data: {
        is_detail: false
      }
    });

    this.refs.detail.refs.wrappedComponent.refs.formWrappedComponent.handleReset();
  }

  handleStart(data) {
    if (this.props.clazz.is_load) {
      return true;
    }

    this.props.dispatch({
      type: 'clazz/fetch',
      data: data
    });

    return false;
  }

  handleFinish() {
    this.props.dispatch({
      type: 'clazz/fetch',
      data: {
        is_load: false
      }
    });
  }

  handleReset() {
    request.cancel();

    this.props.dispatch({
      type: 'clazz/fetch',
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
      dataIndex: 'clazz_name'
    }, {
      width: 90,
      title: '选课限制人数',
      dataIndex: 'clazz_course_apply_limit'
    }, {
      width: 90,
      title: constant.action,
      dataIndex: '',
      render: (text, record, index) => (
        <span>
          <a onClick={this.handleUpdate.bind(this, record.clazz_id)}>{constant.update}</a>
          <span className={style.divider}/>
          <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                      cancelText={constant.popconfirm_cancel} onConfirm={this.handleDelete.bind(this, record.clazz_id)}>
            <a>{constant.delete}</a>
          </Popconfirm>
        </span>
      )
    }];

    const pagination = {
      total: this.props.clazz.total,
      current: this.props.clazz.page_index,
      pageSize: this.props.clazz.page_size,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize.bind(this),
      onChange: this.handleLoad.bind(this)
    };

    return (
      <QueueAnim>
        <div key="0">
          <Row className={style.layoutContentHeader}>
            <Col span={8}>
              <h1>班级列表</h1>
            </Col>
            <Col span={16} className={style.layoutContentHeaderMenu}>
              <Button type="default" icon="search" size="default" className={style.layoutContentHeaderMenuButton}
                      loading={this.props.clazz.is_load}
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
                    getFieldDecorator('clazz_name', {
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
                 loading={this.props.clazz.is_load && !this.props.clazz.is_detail} columns={columns}
                 dataSource={this.props.clazz.list} pagination={pagination} scroll={{y: constant.scrollHeight()}}
                 bordered/>
          <ClazzDetail is_load={this.props.clazz.is_load}
                      is_detail={this.props.clazz.is_detail}
                      handleSubmit={this.handleSubmit.bind(this)}
                      handleCancel={this.handleCancel.bind(this)}
                      ref="detail"/>
        </div>
      </QueueAnim>
    );
  }
}

ClazzIndex.propTypes = {};

ClazzIndex = Form.create({})(ClazzIndex);

export default connect(({clazz}) => ({
  clazz,
}))(ClazzIndex);
