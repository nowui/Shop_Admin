import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Input, Table, Popconfirm, message} from 'antd';

import SceneDetail from './SceneDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import request from '../../util/request';
import style from '../style.css';


class SceneIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false
    }
  }

  componentDidMount() {
    this.props.form.setFieldsValue({
      scene_type: this.props.scene.scene_type
    });

    this.handleLoad();

    notification.on('notification_scene_index_load', this, function (data) {
      this.handleLoad();
    });
  }

  componentWillUnmount() {
    notification.remove('notification_scene_index_load', this);
  }

  handleSearch() {
    new Promise(function (resolve, reject) {
      this.props.dispatch({
        type: 'scene/fetch',
        data: {
          scene_type: this.props.form.getFieldValue('scene_type'),
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

    request.post({
      url: '/scene/admin/list',
      data: {
        scene_type: this.props.scene.scene_type,
        page_index: this.props.scene.page_index,
        page_size: this.props.scene.page_size
      },
      success: function (json) {
        this.props.dispatch({
          type: 'scene/fetch',
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
        type: 'scene/fetch',
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
        type: 'scene/fetch',
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
    notification.emit('notification_scene_detail_save', {});
  }

  handleUpdate(scene_id) {
    notification.emit('notification_scene_detail_update', {
      scene_id: scene_id
    });
  }

  handleDelete(scene_id) {
    this.setState({
      is_load: true
    });

    request.post({
      url: '/scene/delete',
      data: {
        scene_id: scene_id
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
      width: 100,
      title: '是否失效',
      dataIndex: 'scene_is_expire',
      render: (text, record, index) => (
        record.scene_is_expire ?
          '已失效'
          :
          ''
      )
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
      size: 'defalut',
      total: this.props.scene.total,
      showTotal: function (total, range) {
        return '总共' + total + '条数据';
      },
      current: this.props.scene.page_index,
      pageSize: this.props.scene.page_size,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize.bind(this),
      onChange: this.handleChangeIndex.bind(this)
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
                      loading={this.state.is_load}
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
          <Table rowKey="scene_id"
                 className={style.layoutContentHeaderTable}
                 loading={this.state.is_load} columns={columns}
                 dataSource={this.props.scene.list} pagination={pagination}
                 bordered/>
          <SceneDetail ref="detail"/>
        </div>
      </QueueAnim>
    );
  }
}

SceneIndex.propTypes = {};

SceneIndex = Form.create({})(SceneIndex);

export default connect(({scene}) => ({
  scene
}))(SceneIndex);
