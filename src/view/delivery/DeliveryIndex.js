import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Input, Table, message} from 'antd';

import DeliveryDetail from './DeliveryDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import request from '../../util/request';
import style from '../style.css';


class DeliveryIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false
    }
  }

  componentDidMount() {
    this.props.form.setFieldsValue({
      delivery_name: this.props.delivery.delivery_name
    });

    this.handleLoad();

    notification.on('notification_delivery_index_load', this, function (data) {
      this.handleLoad();
    });
  }

  componentWillUnmount() {
    notification.remove('notification_delivery_index_load', this);
  }

  handleSearch() {
    new Promise(function (resolve, reject) {
      this.props.dispatch({
        type: 'delivery/fetch',
        data: {
          delivery_name: this.props.form.getFieldValue('delivery_name'),
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
      url: '/delivery/admin/list',
      data: {
        delivery_name: this.props.delivery.delivery_name,
        page_index: this.props.delivery.page_index,
        page_size: this.props.delivery.page_size
      },
      success: function (json) {
        this.props.dispatch({
          type: 'delivery/fetch',
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
        type: 'delivery/fetch',
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
        type: 'delivery/fetch',
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
    notification.emit('notification_delivery_detail_save', {});
  }

  handleUpdate(delivery_id) {
    notification.emit('notification_delivery_detail_update', {
      delivery_id: delivery_id
    });
  }

  handleDelete(delivery_id) {
    this.setState({
      is_load: true
    });

    request.post({
      url: '/delivery/delete',
      data: {
        delivery_id: delivery_id
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
      width: 120,
      title: '名称',
      dataIndex: 'delivery_name'
    }, {
      width: 120,
      title: '电话',
      dataIndex: 'delivery_phone'
    }, {
      title: '地址',
      dataIndex: 'delivery_address'
    }, {
      width: 90,
      title: constant.action,
      dataIndex: '',
      render: (text, record, index) => (
        <span>
          <a onClick={this.handleUpdate.bind(this, record.delivery_id)}>{constant.find}</a>
        </span>
      )
    }];

    const pagination = {
      size: 'defalut',
      total: this.props.delivery.total,
      showTotal: function (total, range) {
        return '总共' + total + '条数据';
      },
      current: this.props.delivery.page_index,
      pageSize: this.props.delivery.page_size,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize.bind(this),
      onChange: this.handleChangeIndex.bind(this)
    };

    return (
      <QueueAnim>
        <div key="0">
          <Row className={style.layoutContentHeader}>
            <Col span={8}>
              <div className={style.layoutContentHeaderTitle}>快递地址列表</div>
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
                <FormItem hasFeedback {...constant.formItemLayout} className={style.formItem} label="名称">
                  {
                    getFieldDecorator('delivery_name', {
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
          <Table rowKey="delivery_id"
                 className={style.layoutContentHeaderTable}
                 loading={this.state.is_load} columns={columns}
                 dataSource={this.props.delivery.list} pagination={pagination}
                 bordered/>
          <DeliveryDetail ref="detail"/>
        </div>
      </QueueAnim>
    );
  }
}

DeliveryIndex.propTypes = {};

DeliveryIndex = Form.create({})(DeliveryIndex);

export default connect(({delivery}) => ({
  delivery
}))(DeliveryIndex);
