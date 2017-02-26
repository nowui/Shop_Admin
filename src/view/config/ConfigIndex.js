import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Input, Table, Popconfirm, message} from 'antd';

import ConfigDetail from './ConfigDetail';
import constant from '../../constant/constant';
import http from '../../util/http';
import style from '../style.css';

let request;

class ConfigIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {
    // this.handleSearch();
  }

  componentWillUnmount() {
    this.handleReset();
  }

  handleSearch() {
    let config_name = this.props.form.getFieldValue('config_name');
    let page_index = 1;

    this.handleList(config_name, page_index);
  }

  handleLoad(page_index) {
    let config_name = this.props.config.config_name;

    this.handleList(config_name, page_index);
  }

  handleList(config_name, page_index) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request = http({
      url: '/config/admin/list',
      data: {
        config_name: config_name,
        page_index: page_index,
        page_size: this.props.config.page_size
      },
      success: function (json) {
        for (let i = 0; i < json.data.length; i++) {
          json.data[i].key = json.data[i].config_id;
        }

        this.props.dispatch({
          type: 'config/fetch',
          data: {
            config_name: config_name,
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
      type: 'config/fetch',
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
      type: 'config/fetch',
      data: {
        is_detail: true,
        action: 'save'
      }
    });
  }

  handleUpdate(config_id) {
    if (this.handleStart({
        is_load: true,
        is_detail: true,
        action: 'update',
        config_id: config_id
      })) {
      return;
    }

    request = http({
      url: '/config/admin/find',
      data: {
        config_id: config_id
      },
      success: function (json) {
        this.refs.detail.setFieldsValue(json.data);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleDelete(config_id) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request = http({
      url: '/config/delete',
      data: {
        config_id: config_id
      },
      success: function (json) {
        message.success(constant.success);

        setTimeout(function () {
          this.handleLoad(this.props.config.page_index);
        }.bind(this), constant.timeout);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleCourseStudentSave() {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request = http({
      url: '/course/student/white/apply/save',
      data: {

      },
      success: function (json) {
        message.success(constant.success);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleCourseApplyDelete() {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request = http({
      url: '/course/apply/all/delete',
      data: {

      },
      success: function (json) {
        message.success(constant.success);
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

    if (this.props.config.action == 'update') {
      data.config_id = this.props.config.config_id;
    }

    request = http({
      url: '/config/' + this.props.config.action,
      data: data,
      success: function (json) {
        message.success(constant.success);

        this.handleCancel();
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleCancel() {
    this.props.dispatch({
      type: 'config/fetch',
      data: {
        is_detail: false
      }
    });

    this.refs.detail.refs.wrappedComponent.refs.formWrappedComponent.handleReset();
  }

  handleStart(data) {
    if (this.props.config.is_load) {
      return true;
    }

    this.props.dispatch({
      type: 'config/fetch',
      data: data
    });

    return false;
  }

  handleFinish() {
    this.props.dispatch({
      type: 'config/fetch',
      data: {
        is_load: false
      }
    });
  }

  handleReset() {
    if (typeof(request) != 'undefined') {
      request.cancel();
    }

    this.props.dispatch({
      type: 'config/fetch',
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
      dataIndex: 'config_name'
    }, {
      width: 90,
      title: constant.action,
      dataIndex: '',
      render: (text, record, index) => (
        <span>
          <a onClick={this.handleUpdate.bind(this, record.config_id)}>{constant.update}</a>
          {/*<span className={style.divider}/>*/}
          {/*<Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}*/}
          {/*cancelText={constant.popconfirm_cancel} onConfirm={this.handleDelete.bind(this, record.config_id)}>*/}
          {/*<a>{constant.delete}</a>*/}
          {/*</Popconfirm>*/}
        </span>
      )
    }];

    const pagination = {
      total: this.props.config.total,
      current: this.props.config.page_index,
      pageSize: this.props.config.page_size,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize.bind(this),
      onChange: this.handleLoad.bind(this)
    };

    return (
      <QueueAnim>
        <div key="0">
          <Row className={style.layoutContentHeader}>
            <Col span={8}>
              <h1>系统配置列表</h1>
            </Col>
            <Col span={16} className={style.layoutContentHeaderMenu}>
              {/*<Button type="default" icon="lock" size="default" className={style.layoutContentHeaderMenuButton}*/}
                      {/*loading={this.props.config.is_load}*/}
                      {/*onClick={this.handleCourseStudentSave.bind(this)}>设置课程白名单</Button>*/}
              {/*<Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}*/}
                          {/*cancelText={constant.popconfirm_cancel}*/}
                          {/*onConfirm={this.handleCourseApplyDelete.bind(this)}>*/}
                {/*<Button type="default" icon="delete" size="default">删除选课数据</Button>*/}
              {/*</Popconfirm>*/}
            </Col>
          </Row>
          <Form className={style.layoutContentHeaderSearch}>
            <Row>
              <Col span={8}>
                <FormItem hasFeedback {...constant.formItemLayout} className={style.formItem} label="名称">
                  {
                    getFieldDecorator('config_name', {
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
                 loading={this.props.config.is_load && !this.props.config.is_detail} columns={columns}
                 dataSource={this.props.config.list} pagination={pagination} scroll={{y: constant.scrollHeight()}}
                 bordered/>
          <ConfigDetail is_load={this.props.config.is_load}
                        is_detail={this.props.config.is_detail}
                        handleSubmit={this.handleSubmit.bind(this)}
                        handleCancel={this.handleCancel.bind(this)}
                        ref="detail"/>
        </div>
      </QueueAnim>
    );
  }
}

ConfigIndex.propTypes = {};

ConfigIndex = Form.create({})(ConfigIndex);

export default connect(({config}) => ({
  config,
}))(ConfigIndex);
