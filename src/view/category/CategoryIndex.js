import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Input, Table, Popconfirm, message} from 'antd';

import CategoryDetail from './CategoryDetail';
import CategoryTree from './CategoryTree';
import constant from '../../constant/constant';
import http from '../../util/http';
import style from '../style.css';

let request;

class CategoryIndex extends Component {
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
    let category_name = this.props.form.getFieldValue('category_name');
    let page_index = 1;

    this.handleList(category_name, page_index);
  }

  handleLoad(page_index) {
    let category_name = this.props.category.category_name;

    this.handleList(category_name, page_index);
  }

  handleList(category_name, page_index) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request = http({
      url: '/category/admin/list',
      data: {
        category_name: category_name,
        page_index: page_index,
        page_size: this.props.category.page_size
      },
      success: function (json) {
        for (let i = 0; i < json.data.length; i++) {
          json.data[i].key = json.data[i].category_id;
        }

        this.props.dispatch({
          type: 'category/fetch',
          data: {
            category_name: category_name,
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
      type: 'category/fetch',
      data: {
        page_size: page_size
      }
    });

    setTimeout(function () {
      this.handleLoad(page_index);
    }.bind(this), constant.timeout);
  }

  handleSave(parent_id) {
    this.props.dispatch({
      type: 'category/fetch',
      data: {
        is_detail: true,
        action: 'save',
        parent_id: parent_id
      }
    });
  }

  handleUpdate(category_id) {
    if (this.handleStart({
        is_load: true,
        is_detail: true,
        action: 'update',
        category_id: category_id
      })) {
      return;
    }

    request = http({
      url: '/category/admin/find',
      data: {
        category_id: category_id
      },
      success: function (json) {
        this.refs.detail.setFieldsValue(json.data);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleTree(category_id) {
    if (this.handleStart({
        is_load: true,
        is_tree: true,
        category_id: category_id
      })) {
      return;
    }

    request = http({
      url: '/category/admin/tree/list',
      data: {
        category_id: category_id
      },
      success: function (json) {
        this.refs.tree.setFieldsValue(json.data);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleDelete(category_id) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request = http({
      url: '/category/delete',
      data: {
        category_id: category_id
      },
      success: function (json) {
        message.success(constant.success);

        setTimeout(function () {
          if (this.props.category.is_tree) {
            this.handleTree(this.refs.tree.state.category_id);
          } else {
            this.handleLoad(this.props.category.page_index);
          }
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

    if (this.props.category.action == 'update') {
      data.category_id = this.props.category.category_id;
    }

    if (this.props.category.action == 'save' && this.props.category.is_tree) {
      data.parent_id = this.props.category.parent_id;
    }

    request = http({
      url: '/category/' + this.props.category.action,
      data: data,
      success: function (json) {
        message.success(constant.success);

        this.handleCancel();

        setTimeout(function () {
          if (this.props.category.is_tree) {
            this.handleTree(this.refs.tree.state.category_id);
          } else {
            this.handleLoad(this.props.category.page_index);
          }
        }.bind(this), constant.timeout);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleCancel() {
    this.props.dispatch({
      type: 'category/fetch',
      data: {
        is_detail: false
      }
    });

    this.refs.detail.refs.wrappedComponent.refs.formWrappedComponent.handleReset();
  }

  handleTreeCancel() {
    this.props.dispatch({
      type: 'category/fetch',
      data: {
        is_tree: false
      }
    });

    this.refs.tree.handleReset();
  }

  handleStart(data) {
    if (this.props.category.is_load) {
      return true;
    }

    this.props.dispatch({
      type: 'category/fetch',
      data: data
    });

    return false;
  }

  handleFinish() {
    this.props.dispatch({
      type: 'category/fetch',
      data: {
        is_load: false
      }
    });
  }

  handleReset() {
    request.cancel();

    this.props.dispatch({
      type: 'category/fetch',
      data: {
        is_detail: false,
        is_tree: false
      }
    });
  }

  render() {
    const FormItem = Form.Item;
    const {getFieldDecorator} = this.props.form;

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
          <a onClick={this.handleUpdate.bind(this, record.category_id)}>{constant.update}</a>
          <span className={style.divider}/>
          <a onClick={this.handleTree.bind(this, record.category_id)}>树形</a>
          <span className={style.divider}/>
          <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                      cancelText={constant.popconfirm_cancel}
                      onConfirm={this.handleDelete.bind(this, record.category_id)}>
            <a>{constant.delete}</a>
          </Popconfirm>
        </span>
      )
    }];

    const pagination = {
      total: this.props.category.total,
      current: this.props.category.page_index,
      pageSize: this.props.category.page_size,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize.bind(this),
      onChange: this.handleLoad.bind(this)
    };

    return (
      <QueueAnim>
        <div key="0">
          <Row className={style.layoutContentHeader}>
            <Col span={8}>
              <h1>分类列表</h1>
            </Col>
            <Col span={16} className={style.layoutContentHeaderMenu}>
              <Button type="default" icon="search" size="default" className={style.layoutContentHeaderMenuButton}
                      loading={this.props.category.is_load}
                      onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
              <Button type="primary" icon="plus-circle" size="default"
                      onClick={this.handleSave.bind(this, '')}>{constant.save}</Button>
            </Col>
          </Row>
          <Form className={style.layoutContentHeaderSearch}>
            <Row>
              <Col span={8}>
                <FormItem hasFeedback {...constant.formItemLayout} className={style.formItem} label="名称">
                  {
                    getFieldDecorator('category_name', {
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
                 loading={this.props.category.is_load && !this.props.category.is_detail} columns={columns}
                 dataSource={this.props.category.list} pagination={pagination} scroll={{y: constant.scrollHeight()}}
                 bordered/>
          <CategoryTree is_load={this.props.category.is_load}
                        is_tree={this.props.category.is_tree}
                        handleSave={this.handleSave.bind(this)}
                        handleUpdate={this.handleUpdate.bind(this)}
                        handleDelete={this.handleDelete.bind(this)}
                        handleCancel={this.handleTreeCancel.bind(this)}
                        ref="tree"/>
          <CategoryDetail is_load={this.props.category.is_load}
                          is_detail={this.props.category.is_detail}
                          handleSubmit={this.handleSubmit.bind(this)}
                          handleCancel={this.handleCancel.bind(this)}
                          ref="detail"/>
        </div>
      </QueueAnim>
    );
  }
}

CategoryIndex.propTypes = {};

CategoryIndex = Form.create({})(CategoryIndex);

export default connect(({category}) => ({
  category,
}))(CategoryIndex);
