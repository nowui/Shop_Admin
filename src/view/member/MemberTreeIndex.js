import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Input, Table, Popconfirm, message} from 'antd';

import MemberTreeDetail from './MemberTreeDetail';
import constant from '../../util/constant';
import request from '../../util/request';
import style from '../style.css';


class MemberTreeIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      member_level_list: []
    }
  }

  componentDidMount() {
    this.handleSearch();

    this.handleMemberLevelList();
  }

  componentWillUnmount() {
    this.handleReset();
  }

  handleMemberLevelList() {
    request.post({
      url: '/member/level/category/list',
      data: {},
      success: function (json) {
        this.setState({
          member_level_list: json.data
        });
      }.bind(this),
      complete: function () {

      }.bind(this)
    });
  }

  handleSearch() {
    let page_index = 1;

    this.handleList(page_index);
  }

  handleLoad(page_index) {
    this.handleList(page_index);
  }

  handleList(page_index) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request.post({
      url: '/member/tree/list',
      data: {

      },
      success: function (json) {
        for (let i = 0; i < json.data.length; i++) {
          json.data[i].key = json.data[i].member_id;
        }

        this.props.dispatch({
          type: 'member_tree/fetch',
          data: {
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
      type: 'member_tree/fetch',
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
      type: 'member_tree/fetch',
      data: {
        is_detail: true,
        action: 'save'
      }
    });
  }

  handleUpdate(member_id) {
    if (this.handleStart({
        is_load: true,
        is_detail: true,
        action: 'update',
        member_id: member_id
      })) {
      return;
    }

    request.post({
      url: '/member/admin/find',
      data: {
        member_id: member_id
      },
      success: function (json) {
        this.refs.detail.refs.wrappedComponent.refs.formWrappedComponent.handleSetFieldsValue(json.data);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    });
  }

  handleDelete(member_id) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request.post({
      url: '/member/delete',
      data: {
        member_id: member_id
      },
      success: function (json) {
        message.success(constant.success);

        setTimeout(function () {
          this.handleLoad(this.props.member_tree.page_index);
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

    if (this.props.member_tree.action == 'update') {
      data.member_id = this.props.member_tree.member_id;
    }

    request.post({
      url: '/member/admin/member/level/update',
      data: data,
      success: function (json) {
        message.success(constant.success);

        this.handleCancel();

        setTimeout(function () {
          this.handleLoad(this.props.member_tree.page_index);
        }.bind(this), constant.timeout);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    });
  }

  handleCancel() {
    this.props.dispatch({
      type: 'member_tree/fetch',
      data: {
        is_detail: false
      }
    });

    this.refs.detail.refs.wrappedComponent.refs.formWrappedComponent.handleReset();
  }

  handleStart(data) {
    if (this.props.member_tree.is_load) {
      return true;
    }

    this.props.dispatch({
      type: 'member_tree/fetch',
      data: data
    });

    return false;
  }

  handleFinish() {
    this.props.dispatch({
      type: 'member_tree/fetch',
      data: {
        is_load: false
      }
    });
  }

  handleReset() {

    this.props.dispatch({
      type: 'member_tree/fetch',
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
      onChange: this.handleLoad.bind(this)
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
                      loading={this.props.member_tree.is_load}
                      onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
              <Button type="primary" icon="plus-circle" size="default"
                      onClick={this.handleSave.bind(this)}>{constant.save}</Button>
            </Col>
          </Row>
          <Table rowKey="member_id"
                 size="default"
                 className={style.layoutContentHeaderTable}
                 loading={this.props.member_tree.is_load && !this.props.member_tree.is_detail} columns={columns}
                 dataSource={this.props.member_tree.list} pagination={false}
                 bordered/>
          <MemberTreeDetail is_load={this.props.member_tree.is_load}
                        is_detail={this.props.member_tree.is_detail}
                        action={this.props.member_tree.action}
                        member_level_list={this.state.member_level_list}
                        handleSubmit={this.handleSubmit.bind(this)}
                        handleCancel={this.handleCancel.bind(this)}
                        ref="detail"/>
        </div>
      </QueueAnim>
    );
  }
}

MemberTreeIndex.propTypes = {};

MemberTreeIndex = Form.create({})(MemberTreeIndex);

export default connect(({member_tree}) => ({
  member_tree,
}))(MemberTreeIndex);
