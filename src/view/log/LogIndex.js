import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Input, Table, Popconfirm, Select, message} from 'antd';

import LogDetail from './LogDetail';
import constant from '../../constant/constant';
import http from '../../util/http';
import style from '../style.css';

let request;

class LogIndex extends Component {
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
    let log_url = this.props.form.getFieldValue('log_url');
    let page_index = 1;

    this.handleList(log_url, page_index);
  }

  handleLoad(page_index) {
    let log_url = this.props.log.log_url;

    this.handleList(log_url, page_index);
  }

  handleList(log_url, page_index) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request = http({
      url: '/log/admin/list',
      data: {
        log_url: log_url,
        page_index: page_index,
        page_size: this.props.log.page_size
      },
      success: function (json) {
        for (let i = 0; i < json.data.length; i++) {
          json.data[i].key = json.data[i].log_id;
        }

        this.props.dispatch({
          type: 'log/fetch',
          data: {
            log_url: log_url,
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
      type: 'log/fetch',
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
      type: 'log/fetch',
      data: {
        is_detail: true,
        action: 'save'
      }
    });
  }

  handleUpdate(log_id) {
    if (this.handleStart({
        is_load: true,
        is_detail: true,
        action: 'update',
        log_id: log_id
      })) {
      return;
    }

    request = http({
      url: '/log/admin/find',
      data: {
        log_id: log_id
      },
      success: function (json) {
        this.refs.detail.setFieldsValue(json.data);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleDelete(log_id) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request = http({
      url: '/log/delete',
      data: {
        log_id: log_id
      },
      success: function (json) {
        message.success(constant.success);

        setTimeout(function () {
            this.handleLoad(this.props.log.page_index);
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

    if (this.props.log.action == 'update') {
      data.log_id = this.props.log.log_id;
    }

    request = http({
      url: '/log/' + this.props.log.action,
      data: data,
      success: function (json) {
        message.success(constant.success);

        this.handleCancel();

        setTimeout(function () {
            this.handleLoad(this.props.log.page_index);
        }.bind(this), constant.timeout);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleCancel() {
    this.props.dispatch({
      type: 'log/fetch',
      data: {
        is_detail: false
      }
    });

    this.refs.detail.refs.wrappedComponent.refs.formWrappedComponent.handleReset();
  }

  handleStart(data) {
    if (this.props.log.is_load) {
      return true;
    }

    this.props.dispatch({
      type: 'log/fetch',
      data: data
    });

    return false;
  }

  handleFinish() {
    this.props.dispatch({
      type: 'log/fetch',
      data: {
        is_load: false
      }
    });
  }

  handleReset() {
    request.cancel();

    this.props.dispatch({
      type: 'log/fetch',
      data: {
        is_detail: false
      }
    });
  }

  render() {
    const FormItem = Form.Item;
    const Option = Select.Option;
    const {getFieldDecorator} = this.props.form;

    const columns = [{
      title: '地址',
      dataIndex: 'log_url'
    }, {
      width: 90,
      title: '状态',
      dataIndex: 'log_code'
    }, {
      width: 90,
      title: '平台',
      dataIndex: 'log_platform'
    }, {
      width: 90,
      title: '版本',
      dataIndex: 'log_version'
    }, {
      width: 90,
      title: '耗时(毫秒)',
      dataIndex: 'log_run_time'
    }, {
      width: 150,
      title: '创建时间',
      dataIndex: 'log_create_time'
    }, {
      width: 90,
      title: constant.action,
      dataIndex: '',
      render: (text, record, index) => (
        <span>
          <a onClick={this.handleUpdate.bind(this, record.log_id)}>{constant.find}</a>
          {/*<span className={style.divider}/>*/}
          {/*<Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}*/}
                      {/*cancelText={constant.popconfirm_cancel} onConfirm={this.handleDelete.bind(this, record.log_id)}>*/}
            {/*<a>记录</a>*/}
          {/*</Popconfirm>*/}
        </span>
      )
    }];

    const pagination = {
      total: this.props.log.total,
      current: this.props.log.page_index,
      pageSize: this.props.log.page_size,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize.bind(this),
      onChange: this.handleLoad.bind(this)
    };

    return (
      <QueueAnim>
        <div key="0">
          <Row className={style.layoutContentHeader}>
            <Col span={8}>
              <h1>日志列表</h1>
            </Col>
            <Col span={16} className={style.layoutContentHeaderMenu}>
              <Button type="default" icon="search" size="default"
                      loading={this.props.log.is_load}
                      onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
            </Col>
          </Row>
          <Form className={style.layoutContentHeaderSearch}>
            <Row>
              <Col span={8}>
                <FormItem hasFeedback {...constant.formItemLayout} className={style.formItem} label="请求地址">
                  {
                    getFieldDecorator('log_url', {
                      initialValue: ''
                    })(
                      <Input type="text" placeholder="请输入请求地址" className={style.formItemInput}/>
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem hasFeedback {...constant.formItemLayout} className={style.formItem} label="请求状态">
                  {
                    getFieldDecorator('log_code', {
                    })(
                      <Select placeholder="请选择请求状态" className={style.formItemInput}>
                        <Option key="" value="">全部</Option>
                        <Option key="200" value="200">200</Option>
                        <Option key="400" value="400">400</Option>
                        <Option key="500" value="500">500</Option>
                      </Select>
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem hasFeedback {...constant.formItemLayout} className={style.formItem} label="请求平台">
                  {
                    getFieldDecorator('log_platform', {
                    })(
                      <Select placeholder="请选择请求平台" className={style.formItemInput}>
                        <Option key="" value="">全部</Option>
                        <Option key="IOS" value="IOS">IOS</Option>
                        <Option key="WEB" value="WEB">WEB</Option>
                        <Option key="ADMIN" value="ADMIN">ADMIN</Option>
                      </Select>
                    )
                  }
                </FormItem>
              </Col>
            </Row>
          </Form>
          <Table className={style.layoutContentHeaderTable}
                 loading={this.props.log.is_load && !this.props.log.is_detail} columns={columns}
                 dataSource={this.props.log.list} pagination={pagination} scroll={{y: constant.scrollHeight()}}
                 bordered/>
          <LogDetail is_load={this.props.log.is_load}
                      is_detail={this.props.log.is_detail}
                      handleSubmit={this.handleSubmit.bind(this)}
                      handleCancel={this.handleCancel.bind(this)}
                      ref="detail"/>
        </div>
      </QueueAnim>
    );
  }
}

LogIndex.propTypes = {};

LogIndex = Form.create({})(LogIndex);

export default connect(({log}) => ({
  log,
}))(LogIndex);
