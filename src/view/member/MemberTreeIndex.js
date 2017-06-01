import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Table, message} from 'antd';

import MemberDetail from './MemberDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';
import style from '../style.css';


class MemberTreeIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false
    }
  }

  componentDidMount() {
    this.handleLoad();

    this.handleMemberLevelList();

    notification.on('notification_member_tree_index_load', this, function (data) {
      this.handleLoad();
    });
  }

  componentWillUnmount() {
    notification.remove('notification_member_tree_index_load', this);
  }

  handleSearch() {
    new Promise(function (resolve, reject) {
      this.props.dispatch({
        type: 'member_tree/fetch',
        data: {
          member_tree_name: this.props.form.getFieldValue('member_tree_name'),
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
      url: '/member/admin/tree/list',
      data: {
        member_tree_name: this.props.member_tree.member_tree_name,
        page_index: this.props.member_tree.page_index,
        page_size: this.props.member_tree.page_size
      },
      success: function (json) {
        this.props.dispatch({
          type: 'member_tree/fetch',
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

  handleMemberLevelList() {
    http.request({
      url: '/member/level/list',
      data: {},
      success: function (json) {
        this.props.dispatch({
          type: 'member/fetch',
          data: {
            member_level_list: json.data
          }
        });
      }.bind(this),
      complete: function () {

      }.bind(this)
    });
  }

  handleChangeIndex(page_index) {
    new Promise(function (resolve, reject) {
      this.props.dispatch({
        type: 'member_tree/fetch',
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
        type: 'member_tree/fetch',
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
    notification.emit('notification_member_detail_save', {});
  }

  handleUpdate(member_id) {
    notification.emit('notification_member_detail_update', {
      member_id: member_id
    });
  }

  handleDelete(member_tree_id) {

  }

  render() {
    const FormItem = Form.Item;
    const {getFieldDecorator} = this.props.form;

    const columns = [{
      title: '名称',
      dataIndex: 'member_name',
      render: (text, record, index) => (
        <span style={{ position: 'relative' }}>
          <img style={{ position: 'absolute', top: 0, left: 0, width: '17px', height: '17px' }} src={record.user_avatar} />
          <div style={{ position: 'absolute', top: 0, left: 20, width: '300px', lineHeight: '17px' }}>{record.member_name}</div>
        </span>
      )
    }, {
      width: 100,
      title: '等级',
      dataIndex: 'member_level_name'
    }, {
      width: 100,
      title: '总金额',
      dataIndex: 'member_total_amount'
    }, {
      width: 90,
      title: constant.action,
      dataIndex: '',
      render: (text, record, index) => (
        <span>
          <a onClick={this.handleUpdate.bind(this, record.member_id)}>{constant.update}</a>
        </span>
      )
    }];

    const pagination = {
      size: 'defalut',
      total: this.props.member_tree.total,
      showTotal: function (total, range) {
        return '总共' + total + '条数据';
      },
      current: this.props.member_tree.page_index,
      pageSize: this.props.member_tree.page_size,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize.bind(this),
      onChange: this.handleChangeIndex.bind(this)
    };

    return (
      <QueueAnim>
        <div key="0">
          <Row className={style.layoutContentHeader}>
            <Col span={8}>
              <div className={style.layoutContentHeaderTitle}>会员团队列表</div>
            </Col>
            <Col span={16} className={style.layoutContentHeaderMenu}>
              <Button type="default" icon="search" size="default" className={style.layoutContentHeaderMenuButton}
                      loading={this.state.is_load}
                      onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
              <Button type="primary" icon="plus-circle" size="default"
                      onClick={this.handleSave.bind(this)}>{constant.save}</Button>
            </Col>
          </Row>
          <Table rowKey="member_id"
                 size="default"
                 className={style.layoutContentHeaderTable}
                 loading={this.state.is_load} columns={columns}
                 dataSource={this.props.member_tree.list} pagination={false}
                 bordered/>
          <MemberDetail/>
        </div>
      </QueueAnim>
    );
  }
}

MemberTreeIndex.propTypes = {};

MemberTreeIndex = Form.create({})(MemberTreeIndex);

export default connect(({member_tree}) => ({
  member_tree
}))(MemberTreeIndex);
