import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Input, Table, Popconfirm, message} from 'antd';

import MemberDetail from './MemberDetail';
import constant from '../../constant/constant';
import http from '../../util/http';
import style from '../style.css';

let request;

class MemberIndex extends Component {
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
    http({
      url: '/member/level/category/list',
      data: {},
      success: function (json) {
        this.setState({
          member_level_list: json.data
        });
      }.bind(this),
      complete: function () {

      }.bind(this)
    }).post();
  }

  handleSearch() {
    let member_name = this.props.form.getFieldValue('member_name');
    let page_index = 1;

    this.handleList(member_name, page_index);
  }

  handleLoad(page_index) {
    let member_name = this.props.member.member_name;

    this.handleList(member_name, page_index);
  }

  handleList(member_name, page_index) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request = http({
      url: '/member/admin/list',
      data: {
        member_name: member_name,
        page_index: page_index,
        page_size: this.props.member.page_size
      },
      success: function (json) {
        for (let i = 0; i < json.data.length; i++) {
          json.data[i].key = json.data[i].member_id;
        }

        this.props.dispatch({
          type: 'member/fetch',
          data: {
            member_name: member_name,
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
      type: 'member/fetch',
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
      type: 'member/fetch',
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

    request = http({
      url: '/member/admin/find',
      data: {
        member_id: member_id
      },
      success: function (json) {
        this.refs.detail.setFieldsValue(json.data);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleDelete(member_id) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request = http({
      url: '/member/delete',
      data: {
        member_id: member_id
      },
      success: function (json) {
        message.success(constant.success);

        setTimeout(function () {
          this.handleLoad(this.props.member.page_index);
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

    if (this.props.member.action == 'update') {
      data.member_id = this.props.member.member_id;
    }

    request = http({
      url: '/member/' + this.props.member.action,
      data: data,
      success: function (json) {
        message.success(constant.success);

        this.handleCancel();

        setTimeout(function () {
          this.handleLoad(this.props.member.page_index);
        }.bind(this), constant.timeout);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleCancel() {
    this.props.dispatch({
      type: 'member/fetch',
      data: {
        is_detail: false
      }
    });

    this.refs.detail.refs.wrappedComponent.refs.formWrappedComponent.handleReset();
  }

  handleStart(data) {
    if (this.props.member.is_load) {
      return true;
    }

    this.props.dispatch({
      type: 'member/fetch',
      data: data
    });

    return false;
  }

  handleFinish() {
    this.props.dispatch({
      type: 'member/fetch',
      data: {
        is_load: false
      }
    });
  }

  handleReset() {
    request.cancel();

    this.props.dispatch({
      type: 'member/fetch',
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
      dataIndex: 'member_name'
    }, {
      width: 90,
      title: constant.action,
      dataIndex: '',
      render: (text, record, index) => (
        <span>
          <a onClick={this.handleUpdate.bind(this, record.member_id)}>{constant.update}</a>
          <span className={style.divider}/>
          <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                      cancelText={constant.popconfirm_cancel}
                      onConfirm={this.handleDelete.bind(this, record.member_id)}>
            <a>{constant.delete}</a>
          </Popconfirm>
        </span>
      )
    }];

    const pagination = {
      total: this.props.member.total,
      current: this.props.member.page_index,
      pageSize: this.props.member.page_size,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize.bind(this),
      onChange: this.handleLoad.bind(this)
    };

    return (
      <QueueAnim>
        <div key="0">
          <Row className={style.layoutContentHeader}>
            <Col span={8}>
              <div className={style.layoutContentHeaderTitle}>会员列表</div>
            </Col>
            <Col span={16} className={style.layoutContentHeaderMenu}>
              <Button type="default" icon="search" size="default" className={style.layoutContentHeaderMenuButton}
                      loading={this.props.member.is_load}
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
                    getFieldDecorator('member_name', {
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
                 loading={this.props.member.is_load && !this.props.member.is_detail} columns={columns}
                 dataSource={this.props.member.list} pagination={pagination} scroll={{y: constant.scrollHeight()}}
                 bordered/>
          <MemberDetail is_load={this.props.member.is_load}
                        is_detail={this.props.member.is_detail}
                        action={this.props.member.action}
                        member_level_list={this.state.member_level_list}
                        handleSubmit={this.handleSubmit.bind(this)}
                        handleCancel={this.handleCancel.bind(this)}
                        ref="detail"/>
        </div>
      </QueueAnim>
    );
  }
}

MemberIndex.propTypes = {};

MemberIndex = Form.create({})(MemberIndex);

export default connect(({member}) => ({
  member,
}))(MemberIndex);
