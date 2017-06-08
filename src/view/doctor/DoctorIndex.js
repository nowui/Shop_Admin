import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Input, Table, Popconfirm, message} from 'antd';

import DoctorDetail from './DoctorDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';
import style from '../style.css';


class DoctorIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false
    }
  }

  componentDidMount() {
    this.props.form.setFieldsValue({
      doctor_name: this.props.doctor.doctor_name
    });

    this.handleLoad();

    notification.on('notification_doctor_index_load', this, function (data) {
      this.handleLoad();
    });
  }

  componentWillUnmount() {
    notification.remove('notification_doctor_index_load', this);
  }

  handleSearch() {
    new Promise(function (resolve, reject) {
      this.props.dispatch({
        type: 'doctor/fetch',
        data: {
          doctor_name: this.props.form.getFieldValue('doctor_name'),
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
      url: '/doctor/admin/list',
      data: {
        doctor_name: this.props.doctor.doctor_name,
        page_index: this.props.doctor.page_index,
        page_size: this.props.doctor.page_size
      },
      success: function (json) {
        this.props.dispatch({
          type: 'doctor/fetch',
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
        type: 'doctor/fetch',
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
        type: 'doctor/fetch',
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
    notification.emit('notification_doctor_detail_save', {});
  }

  handleUpdate(doctor_id) {
    notification.emit('notification_doctor_detail_update', {
      doctor_id: doctor_id
    });
  }

  handleDelete(doctor_id) {
    this.setState({
      is_load: true
    });

    http.request({
      url: '/doctor/delete',
      data: {
        doctor_id: doctor_id
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
      dataIndex: 'doctor_name'
    }, {
      width: 90,
      title: constant.action,
      dataIndex: '',
      render: (text, record, index) => (
        <span>
          <a onClick={this.handleUpdate.bind(this, record.doctor_id)}>{constant.update}</a>
          <span className={style.divider}/>
          <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                      cancelText={constant.popconfirm_cancel}
                      onConfirm={this.handleDelete.bind(this, record.doctor_id)}>
            <a>{constant.delete}</a>
          </Popconfirm>
        </span>
      )
    }];

    const pagination = {
      size: 'defalut',
      total: this.state.total,
      showTotal: function (total, range) {
        return '总共' + total + '条数据';
      },
      current: this.state.page_index,
      pageSize: this.state.page_size,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize.bind(this),
      onChange: this.handleChangeIndex.bind(this)
    };

    return (
      <QueueAnim>
        <div key="0">
          <Row className={style.layoutContentHeader}>
            <Col span={8}>
              <div className={style.layoutContentHeaderTitle}>医生列表</div>
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
                    getFieldDecorator('doctor_name', {
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
          <Table rowKey="doctor_id"
                 className={style.layoutContentHeaderTable}
                 loading={this.state.is_load} columns={columns}
                 dataSource={this.props.doctor.list} pagination={pagination}
                 bordered/>
          <DoctorDetail/>
        </div>
      </QueueAnim>
    );
  }
}

DoctorIndex.propTypes = {};

DoctorIndex = Form.create({})(DoctorIndex);

export default connect(({doctor}) => ({
  doctor
}))(DoctorIndex);