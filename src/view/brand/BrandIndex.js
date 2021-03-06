import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Input, Table, Popconfirm, message} from 'antd';

import BrandDetail from './BrandDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';
import style from '../style.css';


class BrandIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false
    }
  }

  componentDidMount() {
    this.props.form.setFieldsValue({
      brand_name: this.props.brand.brand_name
    });

    this.handleLoad();

    notification.on('notification_brand_index_load', this, function (data) {
      this.handleLoad();
    });
  }

  componentWillUnmount() {
    notification.remove('notification_brand_index_load', this);
  }

  handleSearch() {
    new Promise(function (resolve, reject) {
      this.props.dispatch({
        type: 'brand/fetch',
        data: {
          brand_name: this.props.form.getFieldValue('brand_name'),
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
      url: '/brand/admin/list',
      data: {
        brand_name: this.props.brand.brand_name,
        page_index: this.props.brand.page_index,
        page_size: this.props.brand.page_size
      },
      success: function (json) {
        this.props.dispatch({
          type: 'brand/fetch',
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
        type: 'brand/fetch',
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
        type: 'brand/fetch',
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
    notification.emit('notification_brand_detail_save', {});
  }

  handleUpdate(brand_id) {
    notification.emit('notification_brand_detail_update', {
      brand_id: brand_id
    });
  }

  handleDelete(brand_id) {
    this.setState({
      is_load: true
    });

    http.request({
      url: '/brand/admin/delete',
      data: {
        brand_id: brand_id
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
      dataIndex: 'brand_name'
    }, {
      width: 90,
      title: constant.action,
      dataIndex: '',
      render: (text, record, index) => (
        <span>
          <a onClick={this.handleUpdate.bind(this, record.brand_id)}>{constant.update}</a>
          <span className={style.divider}/>
          <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                      cancelText={constant.popconfirm_cancel} onConfirm={this.handleDelete.bind(this, record.brand_id)}>
            <a>{constant.delete}</a>
          </Popconfirm>
        </span>
      )
    }];

    const pagination = {
      size: 'defalut',
      total: this.props.brand.total,
      showTotal: function (total, range) {
        return '总共' + total + '条数据';
      },
      current: this.props.brand.page_index,
      pageSize: this.props.brand.page_size,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize.bind(this),
      onChange: this.handleChangeIndex.bind(this)
    };

    return (
      <QueueAnim>
        <div key="0">
          <Row className={style.layoutContentHeader}>
            <Col span={8}>
              <div className={style.layoutContentHeaderTitle}>品牌列表</div>
            </Col>
            <Col span={16} className={style.layoutContentHeaderMenu}>
              <Button type="default" icon="search" size="default" className={style.layoutContentHeaderMenuButton}
                      loading={this.state.is_load}
                      onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
              <Button type="primary" icon="plus-circle" size="default"
                      onClick={this.handleSave.bind(this)}>{constant.save}</Button>
            </Col>
          </Row>
          <Form className={style.layoutContentHeaderSearch}>
            <Row>
              <Col span={8}>
                <FormItem hasFeedback {...constant.formItemLayout} className={style.formSearchItem} label="名称">
                  {
                    getFieldDecorator('brand_name', {
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
          <Table rowKey="brand_id"
                 className={style.layoutContentHeaderTable}
                 loading={this.state.is_load} columns={columns}
                 dataSource={this.props.brand.list} pagination={pagination}
                 bordered/>
          <BrandDetail/>
        </div>
      </QueueAnim>
    );
  }
}

BrandIndex.propTypes = {};

BrandIndex = Form.create({})(BrandIndex);

export default connect(({brand}) => ({
  brand
}))(BrandIndex);
