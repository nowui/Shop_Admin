import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Input, Table, Popconfirm, message} from 'antd';

import SceneDetail from './SceneDetail';
import constant from '../../util/constant';
import http from '../../util/http';
import style from '../style.css';

let request;

class SceneIndex extends Component {
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
    let scene_type = this.props.form.getFieldValue('scene_type');
    let page_index = 1;

    this.handleList(scene_type, page_index);
  }

  handleLoad(page_index) {
    let scene_type = this.props.scene.scene_type;

    this.handleList(scene_type, page_index);
  }

  handleList(scene_type, page_index) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request = http({
      url: '/scene/admin/list',
      data: {
        scene_type: scene_type,
        page_index: page_index,
        page_size: this.props.scene.page_size
      },
      success: function (json) {
        for (let i = 0; i < json.data.length; i++) {
          json.data[i].key = json.data[i].scene_id;
        }

        this.props.dispatch({
          type: 'scene/fetch',
          data: {
            scene_type: scene_type,
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
      type: 'scene/fetch',
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
      type: 'scene/fetch',
      data: {
        is_detail: true,
        action: 'save'
      }
    });
  }

  handleUpdate(scene_id) {
    if (this.handleStart({
        is_load: true,
        is_detail: true,
        action: 'update',
        scene_id: scene_id
      })) {
      return;
    }

    request = http({
      url: '/scene/admin/find',
      data: {
        scene_id: scene_id
      },
      success: function (json) {
        this.refs.detail.refs.wrappedComponent.refs.formWrappedComponent.handleSetFieldsValue(json.data);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleDelete(scene_id) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request = http({
      url: '/scene/delete',
      data: {
        scene_id: scene_id
      },
      success: function (json) {
        message.success(constant.success);

        setTimeout(function () {
          this.handleLoad(this.props.scene.page_index);
        }.bind(this), constant.timeout);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleSubmit(data) {
    if (this.props.scene.action == 'update') {
      this.handleCancel();

      return;
    }

    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    if (this.props.scene.action == 'update') {
      data.scene_id = this.props.scene.scene_id;
    }

    request = http({
      url: '/scene/' + this.props.scene.action,
      data: data,
      success: function (json) {
        message.success(constant.success);

        this.handleCancel();

        setTimeout(function () {
          this.handleLoad(this.props.scene.page_index);
        }.bind(this), constant.timeout);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleCancel() {
    this.props.dispatch({
      type: 'scene/fetch',
      data: {
        is_detail: false
      }
    });

    this.refs.detail.refs.wrappedComponent.refs.formWrappedComponent.handleReset();
  }

  handleStart(data) {
    if (this.props.scene.is_load) {
      return true;
    }

    this.props.dispatch({
      type: 'scene/fetch',
      data: data
    });

    return false;
  }

  handleFinish() {
    this.props.dispatch({
      type: 'scene/fetch',
      data: {
        is_load: false
      }
    });
  }

  handleReset() {
    request.cancel();

    this.props.dispatch({
      type: 'scene/fetch',
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
      dataIndex: 'scene_type',
      render: (text, record, index) => (
        <span>
          {
            text == 'PLATFORM'?
              '平台二维码'
              :
              ''
          }
          {
            text == 'DISTRIBUTOR'?
              '供应商二维码'
              :
              ''
          }
          {
            text == 'MEMBER'?
              '会员二维码'
              :
              ''
          }
        </span>
      )
    }, {
      width: 100,
      title: '新增关注',
      dataIndex: 'scene_add'
    }, {
      width: 100,
      title: '取消关注',
      dataIndex: 'scene_cancel'
    }, {
      width: 90,
      title: constant.action,
      dataIndex: '',
      render: (text, record, index) => (
        <span>
          <a onClick={this.handleUpdate.bind(this, record.scene_id)}>{constant.find}</a>
          <span className={style.divider}/>
          <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                      cancelText={constant.popconfirm_cancel} onConfirm={this.handleDelete.bind(this, record.scene_id)}>
            <a>{constant.delete}</a>
          </Popconfirm>
        </span>
      )
    }];

    const pagination = {
      total: this.props.scene.total,
      current: this.props.scene.page_index,
      pageSize: this.props.scene.page_size,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize.bind(this),
      onChange: this.handleLoad.bind(this)
    };

    return (
      <QueueAnim>
        <div key="0">
          <Row className={style.layoutContentHeader}>
            <Col span={8}>
              <div className={style.layoutContentHeaderTitle}>二维码列表</div>
            </Col>
            <Col span={16} className={style.layoutContentHeaderMenu}>
              <Button type="default" icon="search" size="default" className={style.layoutContentHeaderMenuButton}
                      loading={this.props.scene.is_load}
                      onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
              <Button type="primary" icon="plus-circle" size="default"
                      onClick={this.handleSave.bind(this)}>新增平台二维码</Button>
            </Col>
          </Row>
          <Form className={style.layoutContentHeaderSearch}>
            <Row>
              <Col span={8}>
                <FormItem hasFeedback {...constant.formItemLayout} className={style.formItem} label="名称">
                  {
                    getFieldDecorator('scene_type', {
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
                 loading={this.props.scene.is_load && !this.props.scene.is_detail} columns={columns}
                 dataSource={this.props.scene.list} pagination={pagination} scroll={{y: constant.scrollHeight()}}
                 bordered/>
          <SceneDetail is_load={this.props.scene.is_load}
                       is_detail={this.props.scene.is_detail}
                       action={this.props.scene.action}
                       handleSubmit={this.handleSubmit.bind(this)}
                       handleCancel={this.handleCancel.bind(this)}
                       ref="detail"/>
        </div>
      </QueueAnim>
    );
  }
}

SceneIndex.propTypes = {};

SceneIndex = Form.create({})(SceneIndex);

export default connect(({scene}) => ({
  scene,
}))(SceneIndex);
