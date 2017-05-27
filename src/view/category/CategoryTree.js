import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Row, Col, Button, Table, Popconfirm, message} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import request from '../../util/request';
import style from '../style.css';

class CategoryTree extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false,
      is_show: false,
      category_id: '',
      category_name: '',
      children: [],
      expandedRowKeys: []
    }
  }

  componentDidMount() {
    notification.on('notification_category_tree_update', this, function (data) {
      new Promise(function (resolve, reject) {
        this.setState({
          is_show: true,
          action: 'update',
          category_id: data.category_id
        });

        resolve();
      }.bind(this)).then(function () {
        this.handleLoad();
      }.bind(this));
    });

    notification.on('notification_category_tree_load', this, function (data) {
      this.handleLoad();
    });
  }

  componentWillUnmount() {
    notification.remove('notification_category_tree_update', this);

    notification.remove('notification_category_tree_load', this);
  }

  handleLoad() {
    this.setState({
      is_load: true
    });

    request.post({
      url: '/category/admin/tree/list',
      data: {
        category_id: this.state.category_id
      },
      success: function (json) {
        var expandedRowKeys = this.checkList(json.data.children);

        this.setState({
          category_id: json.data.category_id,
          category_name: json.data.category_name,
          children: json.data.children,
          expandedRowKeys: expandedRowKeys
        });
      }.bind(this),
      complete: function () {
        this.setState({
          is_load: false
        });

      }.bind(this)
    });
  }

  setFieldsValue(data) {
    var expandedRowKeys = this.checkList(data.children);

    this.setState({
      category_id: data.category_id,
      category_name: data.category_name,
      children: data.children,
      expandedRowKeys: expandedRowKeys
    });
  }

  checkList(list) {
    var expandedRowKeys = [];

    for (var i = 0; i < list.length; i++) {
      expandedRowKeys.push(list[i].category_id);

      if (list[i].children) {
        expandedRowKeys = expandedRowKeys.concat(this.checkList(list[i].children));
      }
    }

    return expandedRowKeys;
  }

  handleExpand(expanded, record) {
    var array = this.state.expandedRowKeys;

    if (expanded) {
      array.push(record.category_id);
    } else {
      var index = -1;

      for (var i = 0; i < array.length; i++) {
        if (record.category_id == array[i]) {
          index = i;

          break;
        }
      }

      array.splice(index, 1);
    }

    this.setState({
      expandedRowKeys: array
    });
  }

  handleSave(parent_id) {
    notification.emit('notification_category_detail_save', {
      is_tree: true,
      parent_id: parent_id
    });
  }

  handleUpdate(category_id) {
    notification.emit('notification_category_detail_update', {
      is_tree: true,
      category_id: category_id
    });
  }

  handleDelete(category_id) {
    this.setState({
      is_load: true
    });

    request.post({
      url: '/category/delete',
      data: {
        category_id: category_id
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

  handleCancel() {
    this.setState({
      is_show: false
    });
  }

  render() {
    const columns = [{
      title: '名称',
      dataIndex: 'category_name'
    }, {
      width: 150,
      title: '键值',
      dataIndex: 'category_key'
    }, {
      width: 100,
      title: '排序',
      dataIndex: 'category_sort'
    }, {
      width: 135,
      title: constant.action,
      dataIndex: '',
      render: (text, record, index) => (
        <span>
          <a onClick={this.handleSave.bind(this, record.category_id)}>{constant.save}</a>
          <span className={style.divider}/>
          <a onClick={this.handleUpdate.bind(this, record.category_id)}>{constant.update}</a>
          <span className={style.divider}/>
          <Popconfirm  zIndex={2} title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                      cancelText={constant.popconfirm_cancel}
                      onConfirm={this.handleDelete.bind(this, record.category_id)}>
            <a>{constant.delete}</a>
          </Popconfirm>
        </span>
      )
    }];

    return (
      <Modal title={this.state.category_name} maskClosable={false} width={constant.detail_width} zIndex={1}
             visible={this.state.is_show} onCancel={this.handleCancel.bind(this)}
             footer={[
               <Button key="back" type="ghost" size="default" icon="cross-circle"
                       onClick={this.handleCancel.bind(this)}>关闭</Button>
             ]}
      >
        <Row>
          <Col span={8}>

          </Col>
          <Col span={16} className={style.layoutContentHeaderMenu}>
            <Button type="primary" icon="plus-circle" size="default"
                    onClick={this.handleSave.bind(this, this.state.category_id)}>{constant.save}</Button>
          </Col>
        </Row>
        <Table className={style.layoutContentHeaderTable} expandedRowKeys={this.state.expandedRowKeys}
               onExpand={this.handleExpand.bind(this)} columns={columns} dataSource={this.state.children}
               pagination={false}
               bordered/>
      </Modal>
    );
  }
}

CategoryTree.propTypes = {

};

export default connect(({categorye}) => ({
  categorye
}))(CategoryTree);
