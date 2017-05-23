import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Input, Table, Popconfirm, message} from 'antd';

import ArticleDetail from './ArticleDetail';
import constant from '../../util/constant';
import http from '../../util/http';
import style from '../style.css';

let request;

class ArticleIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      category_list: []
    }
  }

  componentDidMount() {
    this.handleSearch();

    this.handleCategoryList();
  }

  componentWillUnmount() {
    this.handleReset();
  }

  handleCategoryList() {
    http({
      url: '/article/category/list',
      data: {},
      success: function (json) {
        this.setState({
          category_list: json.data
        });
      }.bind(this),
      complete: function () {

      }.bind(this)
    }).post();
  }

  handleSearch() {
    let article_name = this.props.form.getFieldValue('article_name');
    let page_index = 1;

    this.handleList(article_name, page_index);
  }

  handleLoad(page_index) {
    let article_name = this.props.article.article_name;

    this.handleList(article_name, page_index);
  }

  handleList(article_name, page_index) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request = http({
      url: '/article/admin/list',
      data: {
        article_name: article_name,
        page_index: page_index,
        page_size: this.props.article.page_size
      },
      success: function (json) {
        for (let i = 0; i < json.data.length; i++) {
          json.data[i].key = json.data[i].article_id;
        }

        this.props.dispatch({
          type: 'article/fetch',
          data: {
            article_name: article_name,
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
      type: 'article/fetch',
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
      type: 'article/fetch',
      data: {
        is_detail: true,
        action: 'save'
      }
    });
  }

  handleUpdate(article_id) {
    if (this.handleStart({
        is_load: true,
        is_detail: true,
        action: 'update',
        article_id: article_id
      })) {
      return;
    }

    request = http({
      url: '/article/admin/find',
      data: {
        article_id: article_id
      },
      success: function (json) {
        this.refs.detail.refs.wrappedComponent.refs.formWrappedComponent.handleSetFieldsValue(json.data);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleDelete(article_id) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request = http({
      url: '/article/delete',
      data: {
        article_id: article_id
      },
      success: function (json) {
        message.success(constant.success);

        setTimeout(function () {
          this.handleLoad(this.props.article.page_index);
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

    if (this.props.article.action == 'update') {
      data.article_id = this.props.article.article_id;
    }

    request = http({
      url: '/article/' + this.props.article.action,
      data: data,
      success: function (json) {
        message.success(constant.success);

        this.handleCancel();

        setTimeout(function () {
          this.handleLoad(this.props.article.page_index);
        }.bind(this), constant.timeout);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleCancel() {
    this.props.dispatch({
      type: 'article/fetch',
      data: {
        is_detail: false
      }
    });

    this.refs.detail.refs.wrappedComponent.refs.formWrappedComponent.handleReset();
  }

  handleStart(data) {
    if (this.props.article.is_load) {
      return true;
    }

    this.props.dispatch({
      type: 'article/fetch',
      data: data
    });

    return false;
  }

  handleFinish() {
    this.props.dispatch({
      type: 'article/fetch',
      data: {
        is_load: false
      }
    });
  }

  handleReset() {
    request.cancel();

    this.props.dispatch({
      type: 'article/fetch',
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
      dataIndex: 'article_name'
    }, {
      width: 90,
      title: constant.action,
      dataIndex: '',
      render: (text, record, index) => (
        <span>
          <a onClick={this.handleUpdate.bind(this, record.article_id)}>{constant.update}</a>
          <span className={style.divider}/>
          <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                      cancelText={constant.popconfirm_cancel}
                      onConfirm={this.handleDelete.bind(this, record.article_id)}>
            <a>{constant.delete}</a>
          </Popconfirm>
        </span>
      )
    }];

    const pagination = {
      total: this.props.article.total,
      current: this.props.article.page_index,
      pageSize: this.props.article.page_size,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize.bind(this),
      onChange: this.handleLoad.bind(this)
    };

    return (
      <QueueAnim>
        <div key="0">
          <Row className={style.layoutContentHeader}>
            <Col span={8}>
              <div className={style.layoutContentHeaderTitle}>列表</div>
            </Col>
            <Col span={16} className={style.layoutContentHeaderMenu}>
              <Button type="default" icon="search" size="default" className={style.layoutContentHeaderMenuButton}
                      loading={this.props.article.is_load}
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
                    getFieldDecorator('article_name', {
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
                 loading={this.props.article.is_load && !this.props.article.is_detail} columns={columns}
                 dataSource={this.props.article.list} pagination={pagination} scroll={{y: constant.scrollHeight()}}
                 bordered/>
          <ArticleDetail is_load={this.props.article.is_load}
                         is_detail={this.props.article.is_detail}
                         category_list={this.state.category_list}
                         handleSubmit={this.handleSubmit.bind(this)}
                         handleCancel={this.handleCancel.bind(this)}
                         ref="detail"/>
        </div>
      </QueueAnim>
    );
  }
}

ArticleIndex.propTypes = {};

ArticleIndex = Form.create({})(ArticleIndex);

export default connect(({article}) => ({
  article,
}))(ArticleIndex);
