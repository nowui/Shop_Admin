import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Input, Table, Select, message} from 'antd';

import LogDetail from './LogDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';
import style from '../style.css';


class LogIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false
    }
  }

  componentDidMount() {
    this.props.form.setFieldsValue({
      log_url: this.props.log.log_url
    });

    this.handleLoad();

    notification.on('notification_log_index_load', this, function (data) {
      this.handleLoad();
    });
  }

  componentWillUnmount() {
    notification.remove('notification_log_index_load', this);
  }

  handleSearch() {
    new Promise(function (resolve, reject) {
      this.props.dispatch({
        type: 'log/fetch',
        data: {
          log_url: this.props.form.getFieldValue('log_url'),
          log_code: this.props.form.getFieldValue('log_code'),
          log_platform: this.props.form.getFieldValue('log_platform'),
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
      url: '/log/admin/list',
      data: {
        log_url: this.props.log.log_url,
        log_code: this.props.log.log_code,
        log_platform: this.props.log.log_platform,
        page_index: this.props.log.page_index,
        page_size: this.props.log.page_size
      },
      success: function (json) {
        this.props.dispatch({
          type: 'log/fetch',
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
    new Promise(function (resolve, reject) {
      this.props.dispatch({
        type: 'log/fetch',
        data: {
          page_index: page_index
        }
      });

      resolve();
    }.bind(this)).then(function () {
      this.handleLoad();
    }.bind(this));
  }

  handleChangeSize(page_index, page_size) {
    new Promise(function (resolve, reject) {
      this.props.dispatch({
        type: 'log/fetch',
        data: {
          page_index: page_index,
          page_size: page_size
        }
      });

      resolve();
    }.bind(this)).then(function () {
      this.handleLoad();
    }.bind(this));
  }

  handleSave() {
    notification.emit('notification_log_detail_save', {});
  }

  handleUpdate(log_id) {
    notification.emit('notification_log_detail_update', {
      log_id: log_id
    });
  }

  handleDelete(log_id) {
    this.setState({
      is_load: true
    });

    http.request({
      url: '/log/delete',
      data: {
        log_id: log_id
      },
      success: function (json) {
        message.success(constant.success);

        this.handleLoad();
      }.bind(this),
      complete: function () {
        this.setState({
          is_load: false
        });
      }.bind(this)
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
      dataIndex: 'system_create_time'
    }, {
      width: 90,
      title: constant.action,
      dataIndex: '',
      render: (text, record, index) => (
        <span>
          <a onClick={this.handleUpdate.bind(this, record.log_id)}>{constant.find}</a>
        </span>
      )
    }];

    const pagination = {
      size: 'defalut',
      total: this.props.log.total,
      showTotal: function (total, range) {
        return '总共' + total + '条数据';
      },
      current: this.props.log.page_index,
      pageSize: this.props.log.page_size,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize.bind(this),
      onChange: this.handleChangeIndex.bind(this)
    };

    return (
      <QueueAnim>
        <div key="0">
          <Row className={style.layoutContentHeader}>
            <Col span={8}>
              <div className={style.layoutContentHeaderTitle}>日志列表</div>
            </Col>
            <Col span={16} className={style.layoutContentHeaderMenu}>
              <Button type="primary" icon="search" size="default"
                      loading={this.state.is_load}
                      onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
            </Col>
          </Row>
          <Form className={style.layoutContentHeaderSearch}>
            <Row>
              <Col span={8}>
                <FormItem hasFeedback {...constant.formItemLayout} className={style.formSearchItem} label="请求地址">
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
                <FormItem hasFeedback {...constant.formItemLayout} className={style.formSearchItem} label="请求状态">
                  {
                    getFieldDecorator('log_code', {
                      initialValue: ''
                    })(
                      <Select allowClear placeholder="请选择请求状态" className={style.formItemInput}>
                        <Option key="200" value="200">200</Option>
                        <Option key="400" value="400">400</Option>
                        <Option key="500" value="500">500</Option>
                      </Select>
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem hasFeedback {...constant.formItemLayout} className={style.formSearchItem} label="请求平台">
                  {
                    getFieldDecorator('log_platform', {
                      initialValue: ''
                    })(
                      <Select allowClear placeholder="请选择请求平台" className={style.formItemInput}>
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
          <Table rowKey="log_id"
                 className={style.layoutContentHeaderTable}
                 loading={this.state.is_load} columns={columns}
                 dataSource={this.props.log.list} pagination={pagination}
                 bordered/>
          <LogDetail/>
        </div>
      </QueueAnim>
    );
  }
}

LogIndex.propTypes = {};

LogIndex = Form.create({})(LogIndex);

export default connect(({log}) => ({
  log
}))(LogIndex);
