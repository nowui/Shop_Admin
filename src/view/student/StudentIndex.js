import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Input, Table, Popconfirm, Upload, Select, message} from 'antd';

import StudentDetail from './StudentDetail';
import constant from '../../constant/constant';
import database from '../../util/database';
import http from '../../util/http';
import style from '../style.css';

let request;

class StudentIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clazz: [],
      selectedRowKeys: []
    }
  }

  componentDidMount() {
    this.handleClazzList();

    this.handleSearch();
  }

  componentWillUnmount() {
    this.handleReset();
  }

  handleClazzList() {
    http({
      url: '/clazz/list',
      data: {
        clazz_name: '',
        page_index: 0,
        page_size: 0
      },
      success: function (json) {
        let array = [{
          clazz_id: '',
          clazz_name: '所有班级'
        }];

        for (let i = 0; i < json.data.length; i++) {
          array.push(json.data[i]);
        }

        this.setState({
          clazz: array
        });
      }.bind(this),
      complete: function () {

      }.bind(this)
    }).post();
  }

  handleSearch() {
    let student_name = this.props.form.getFieldValue('student_name');
    let clazz_id = this.props.form.getFieldValue('clazz_id');
    let page_index = 1;

    this.handleList(student_name, clazz_id, page_index);
  }

  handleLoad(page_index) {
    let student_name = this.props.student.student_name;
    let clazz_id = this.props.student.clazz_id;

    this.handleList(student_name, clazz_id, page_index);
  }

  handleList(student_name, clazz_id, page_index) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request = http({
      url: '/student/admin/list',
      data: {
        student_name: student_name,
        clazz_id: clazz_id,
        page_index: page_index,
        page_size: this.props.student.page_size
      },
      success: function (json) {
        for (let i = 0; i < json.data.length; i++) {
          json.data[i].key = json.data[i].student_id;
        }

        this.props.dispatch({
          type: 'student/fetch',
          data: {
            student_name: student_name,
            clazz_id: clazz_id,
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
      type: 'student/fetch',
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
      type: 'student/fetch',
      data: {
        is_detail: true,
        action: 'save'
      }
    });
  }

  handleUpdate(student_id) {
    if (this.handleStart({
        is_load: true,
        is_detail: true,
        action: 'update',
        student_id: student_id
      })) {
      return;
    }

    request = http({
      url: '/student/admin/find',
      data: {
        student_id: student_id
      },
      success: function (json) {
        this.refs.detail.setFieldsValue(json.data);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleDelete(student_id) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request = http({
      url: '/student/delete',
      data: {
        student_id: student_id
      },
      success: function (json) {
        message.success(constant.success);

        setTimeout(function () {
          this.handleLoad(this.props.student.page_index);
        }.bind(this), constant.timeout);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleDeleteAll() {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request = http({
      url: '/student/all/delete',
      data: {

      },
      success: function (json) {
        message.success(constant.success);

        setTimeout(function () {
          this.handleLoad(this.props.student.page_index);
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

    if (this.props.student.action == 'update') {
      data.student_id = this.props.student.student_id;
    }

    request = http({
      url: '/student/' + this.props.student.action,
      data: data,
      success: function (json) {
        message.success(constant.success);

        this.handleCancel();

        setTimeout(function () {
          this.handleLoad(this.props.student.page_index);
        }.bind(this), constant.timeout);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleCancel() {
    this.props.dispatch({
      type: 'student/fetch',
      data: {
        is_detail: false
      }
    });

    this.refs.detail.refs.wrappedComponent.refs.formWrappedComponent.handleReset();
  }

  handleStart(data) {
    if (this.props.student.is_load) {
      return true;
    }

    this.props.dispatch({
      type: 'student/fetch',
      data: data
    });

    return false;
  }

  handleFinish() {
    this.props.dispatch({
      type: 'student/fetch',
      data: {
        is_load: false
      }
    });
  }

  handleReset() {
    request.cancel();

    this.props.dispatch({
      type: 'student/fetch',
      data: {
        is_detail: false
      }
    });
  }

  handleChange(info) {
    if (info.file.status === 'done') {
      if (info.file.response.code == 200) {
        message.success(constant.success);
      } else {
        message.error(info.file.response.message);
      }

      this.setState({
        is_load: false
      });

      this.handleLoad();
    } else {
      this.setState({
        is_load: true
      });
    }
  }

  render() {
    const FormItem = Form.Item;
    const Option = Select.Option;
    const {getFieldDecorator} = this.props.form;

    const props = {
      name: 'file',
      multiple: false,
      showUploadList: false,
      accept: '.xls,.xlsx',
      action: constant.host + '/student/upload',
      headers: {
        'Token': database.getToken(),
        'Platform': constant.platform,
        'Version': constant.version
      },
      onChange: this.handleChange.bind(this)
    }

    const columns = [{
      width: 150,
      title: '班级',
      dataIndex: 'clazz_name'
    }, {
      title: '学生名称',
      dataIndex: 'student_name'
    }, {
      width: 150,
      title: '学号',
      dataIndex: 'student_number'
    }, {
      width: 90,
      title: constant.action,
      dataIndex: '',
      render: (text, record, index) => (
        <span>
          <a onClick={this.handleUpdate.bind(this, record.student_id)}>{constant.update}</a>
          <span className={style.divider}/>
          <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                      cancelText={constant.popconfirm_cancel}
                      onConfirm={this.handleDelete.bind(this, record.student_id)}>
            <a>{constant.delete}</a>
          </Popconfirm>
        </span>
      )
    }];

    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys: selectedRowKeys
        });
      }
    };

    const pagination = {
      total: this.props.student.total,
      current: this.props.student.page_index,
      pageSize: this.props.student.page_size,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize.bind(this),
      onChange: this.handleLoad.bind(this)
    };

    return (
      <QueueAnim>
        <div key="0">
          <Row className={style.layoutContentHeader}>
            <Col span={8}>
              <h1>学生列表</h1>
            </Col>
            <Col span={16} className={style.layoutContentHeaderMenu}>
              <Button type="default" icon="search" size="default" className={style.layoutContentHeaderMenuButton}
                      loading={this.props.student.is_load}
                      onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
              <Upload className={style.layoutContentHeaderMenuButton} {...props}>
                <Button type="default" icon="upload" size="default" className="button-reload">导入学生资料</Button>
              </Upload>
              {/*<Button type="default" icon="delete" size="default" className={style.layoutContentHeaderMenuButton}*/}
                      {/*loading={this.props.student.is_load}*/}
                      {/*onClick={this.handleDeleteAll.bind(this)}>删除所有学生</Button>*/}
              <Button type="primary" icon="plus-circle" size="default"
                      onClick={this.handleSave.bind(this)}>{constant.save}</Button>
            </Col>
          </Row>
          <Form className={style.layoutContentHeaderSearch}>
            <Row>
              <Col span={8}>
                <FormItem hasFeedback {...constant.formItemLayout} className={style.formItem} label="学生名称">
                  {
                    getFieldDecorator('student_name', {
                      initialValue: ''
                    })(
                      <Input type="text" placeholder="请输入名称" className={style.formItemInput}/>
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem hasFeedback {...constant.formItemLayout} className={style.formItem} label="所属班级">
                  {
                    getFieldDecorator('clazz_id', {
                      initialValue: ''
                    })(
                      <Select style={{
                        width: '100%'
                      }} placeholder="请选择班级">
                        {
                          this.state.clazz.map(function (item) {
                            return (
                              <Option key={item.clazz_id} value={item.clazz_id}>{item.clazz_name}</Option>
                            )
                          })
                        }
                      </Select>
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
              </Col>
            </Row>
          </Form>
          <Table className={style.layoutContentHeaderTable}
                 loading={this.props.student.is_load && !this.props.student.is_detail} columns={columns}
                 dataSource={this.props.student.list} pagination={pagination} scroll={{y: constant.scrollHeight()}}
                 bordered/>
          <StudentDetail is_load={this.props.student.is_load}
                         is_detail={this.props.student.is_detail}
                         clazz={this.state.clazz}
                         handleSubmit={this.handleSubmit.bind(this)}
                         handleCancel={this.handleCancel.bind(this)}
                         ref="detail"/>
        </div>
      </QueueAnim>
    );
  }
}

StudentIndex.propTypes = {};

StudentIndex = Form.create({})(StudentIndex);

export default connect(({student}) => ({
  student,
}))(StudentIndex);
