import React, {Component, PropTypes} from 'react';
import {Modal, Row, Col, Button, Table, Popconfirm} from 'antd';

import constant from '../../constant/constant';
import style from '../style.css';

class CategoryTree extends Component {
  constructor(props) {
    super(props);

    this.state = {
      category_id: '',
      category_name: '',
      children: [],
      expandedRowKeys: []
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  setFieldsValue(data) {
    let expandedRowKeys = this.checkList(data.children);

    this.setState({
      category_id: data.category_id,
      category_name: data.category_name,
      children: data.children,
      expandedRowKeys: expandedRowKeys
    });
  }

  checkList(list) {
    let expandedRowKeys = [];

    for (let i = 0; i < list.length; i++) {
      expandedRowKeys.push(list[i].category_id);

      if (list[i].children) {
        expandedRowKeys = expandedRowKeys.concat(this.checkList(list[i].children));
      }
    }

    return expandedRowKeys;
  }

  handleExpand(expanded, record) {
    let array = this.state.expandedRowKeys;

    if (expanded) {
      array.push(record.category_id);
    } else {
      let index = -1;

      for (let i = 0; i < array.length; i++) {
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
    this.props.handleSave(parent_id);
  }

  handleUpdate(category_id) {
    this.props.handleUpdate(category_id);
  }

  handleDelete(category_id) {
    this.props.handleDelete(category_id);
  }

  handleCancel() {
    this.props.handleCancel();
  }

  handleReset() {
    setTimeout(function () {
      this.setState({
        category_id: '',
        category_name: '',
        children: [],
        expandedRowKeys: []
      });
    }.bind(this), constant.timeout);
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
             visible={this.props.is_tree} onCancel={this.handleCancel.bind(this)}
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
               scroll={{y: constant.scrollModalHeight()}} size="middle" bordered/>
      </Modal>
    );
  }
}

CategoryTree.propTypes = {
  is_load: React.PropTypes.bool.isRequired,
  is_tree: React.PropTypes.bool.isRequired,
  handleSave: React.PropTypes.func.isRequired,
  handleUpdate: React.PropTypes.func.isRequired,
  handleDelete: React.PropTypes.func.isRequired,
  handleCancel: React.PropTypes.func.isRequired
};

export default CategoryTree;
