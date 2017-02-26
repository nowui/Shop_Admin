import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Input, Table, Popconfirm, Upload, message} from 'antd';

import CourseDetail from './CourseDetail';
import constant from '../../constant/constant';
import database from '../../util/database';
import http from '../../util/http';
import style from '../style.css';

let request;

class CourseIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clazz: [],
      teacher: [],
      white: [],
      black: []
    }
  }

  componentDidMount() {
    this.handleClazzList();

    this.handleTeacherList();

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
        this.setState({
          clazz: json.data
        });
      }.bind(this),
      complete: function () {

      }.bind(this)
    }).post();
  }

  handleTeacherList() {
    http({
      url: '/teacher/list',
      data: {
        teacher_name: '',
        page_index: 0,
        page_size: 0
      },
      success: function (json) {
        this.setState({
          teacher: json.data
        });
      }.bind(this),
      complete: function () {

      }.bind(this)
    }).post();
  }

  handleSearch() {
    let course_name = this.props.form.getFieldValue('course_name');
    let page_index = 1;

    this.handleList(course_name, page_index);
  }

  handleLoad(page_index) {
    let course_name = this.props.course.course_name;

    this.handleList(course_name, page_index);
  }

  handleList(course_name, page_index) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request = http({
      url: '/course/admin/list',
      data: {
        course_name: course_name,
        page_index: page_index,
        page_size: this.props.course.page_size
      },
      success: function (json) {
        for (let i = 0; i < json.data.length; i++) {
          json.data[i].key = json.data[i].course_id;
        }

        this.props.dispatch({
          type: 'course/fetch',
          data: {
            course_name: course_name,
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
      type: 'course/fetch',
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
      type: 'course/fetch',
      data: {
        is_detail: true,
        action: 'save'
      }
    });
  }

  handleUpdate(course_id) {
    if (this.handleStart({
        is_load: true,
        is_detail: true,
        action: 'update',
        course_id: course_id
      })) {
      return;
    }

    request = http({
      url: '/course/admin/find',
      data: {
        course_id: course_id
      },
      success: function (json) {
        this.refs.detail.refs.wrappedComponent.refs.formWrappedComponent.handleSetFieldsValue(json.data);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();

    this.handleWhiteLoad(course_id);
    this.handleBlackLoad(course_id);
  }

  handleDelete(course_id) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request = http({
      url: '/course/delete',
      data: {
        course_id: course_id
      },
      success: function (json) {
        message.success(constant.success);

        setTimeout(function () {
          this.handleLoad(this.props.course.page_index);
        }.bind(this), constant.timeout);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleWhiteLoad(course_id) {
    request = http({
      url: '/course/student/white/list',
      data: {
        course_id: course_id,
      },
      success: function (json) {
        for (let i = 0; i < json.data.length; i++) {
          json.data[i].key = json.data[i].course_student_id;
        }

        this.setState({
          white: json.data
        });
      }.bind(this),
      complete: function () {

      }.bind(this)
    }).post();
  }

  handleBlackLoad(course_id) {
    request = http({
      url: '/course/student/black/list',
      data: {
        course_id: course_id,
      },
      success: function (json) {
        for (let i = 0; i < json.data.length; i++) {
          json.data[i].key = json.data[i].course_student_id;
        }

        this.setState({
          black: json.data
        });
      }.bind(this),
      complete: function () {

      }.bind(this)
    }).post();
  }

  handleWhiteSave(student_id) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request = http({
      url: '/course/student/white/save',
      data: {
        course_id: this.props.course.course_id,
        student_id: student_id
      },
      success: function (json) {
        message.success(constant.success);

        setTimeout(function () {
          this.handleWhiteLoad(this.props.course.course_id);
        }.bind(this), constant.timeout);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleBlackSave(student_id) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request = http({
      url: '/course/student/black/save',
      data: {
        course_id: this.props.course.course_id,
        student_id: student_id
      },
      success: function (json) {
        message.success(constant.success);

        setTimeout(function () {
          this.handleBlackLoad(this.props.course.course_id);
        }.bind(this), constant.timeout);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleStudentDelete(course_student_id, type) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request = http({
      url: '/course/student/delete',
      data: {
        course_student_id: course_student_id
      },
      success: function (json) {
        message.success(constant.success);

        setTimeout(function () {
          if (type == 'white') {
            this.handleWhiteLoad(this.props.course.course_id);
          } else {
            this.handleBlackLoad(this.props.course.course_id);
          }
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
      url: '/course/all/delete',
      data: {},
      success: function (json) {
        message.success(constant.success);

        setTimeout(function () {
          this.handleLoad(this.props.course.page_index);
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

    if (this.props.course.action == 'update') {
      data.course_id = this.props.course.course_id;
    }

    request = http({
      url: '/course/' + this.props.course.action,
      data: data,
      success: function (json) {
        message.success(constant.success);

        this.handleCancel();

        setTimeout(function () {
          this.handleLoad(this.props.course.page_index);
        }.bind(this), constant.timeout);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleCancel() {
    this.props.dispatch({
      type: 'course/fetch',
      data: {
        is_detail: false
      }
    });

    this.refs.detail.refs.wrappedComponent.refs.formWrappedComponent.handleReset();
  }

  handleStart(data) {
    if (this.props.course.is_load) {
      return true;
    }

    this.props.dispatch({
      type: 'course/fetch',
      data: data
    });

    return false;
  }

  handleFinish() {
    this.props.dispatch({
      type: 'course/fetch',
      data: {
        is_load: false
      }
    });
  }

  handleReset() {
    request.cancel();

    this.props.dispatch({
      type: 'course/fetch',
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

  handleExcel() {
    window.open(constant.host + '/course/apply/export')
  }

  render() {
    const FormItem = Form.Item;
    const {getFieldDecorator} = this.props.form;

    const props = {
      name: 'file',
      multiple: false,
      showUploadList: false,
      accept: '.xls,.xlsx',
      action: constant.host + '/course/upload',
      headers: {
        'Token': database.getToken(),
        'Platform': constant.platform,
        'Version': constant.version
      },
      onChange: this.handleChange.bind(this)
    };

    const columns = [{
      title: '课程名称',
      dataIndex: 'course_name'
    }, {
      width: 200,
      title: '老师姓名',
      dataIndex: 'course_teacher'
    }, {
      width: 150,
      title: '课程时间',
      dataIndex: 'course_time',
      render: (text, record, index) => (
        <span>
          {
            text == 17 ? '星期一第七节' : ''
          }
          {
            text == 27 ? '星期二第七节' : ''
          }
          {
            text == 28 ? '星期二第八节' : ''
          }
          {
            text == 47 ? '星期四第七节' : ''
          }
          {
            text == 48 ? '星期四第七节' : ''
          }
          {
            text == 56 ? '星期五第六节' : ''
          }
        </span>
      )
    }, {
      width: 150,
      title: '限制人数',
      dataIndex: 'course_apply_limit'
    }, {
      width: 90,
      title: constant.action,
      dataIndex: '',
      render: (text, record, index) => (
        <span>
          <a onClick={this.handleUpdate.bind(this, record.course_id)}>{constant.update}</a>
          <span className={style.divider}/>
          <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                      cancelText={constant.popconfirm_cancel}
                      onConfirm={this.handleDelete.bind(this, record.course_id)}>
            <a>{constant.delete}</a>
          </Popconfirm>
        </span>
      )
    }];

    const pagination = {
      total: this.props.course.total,
      current: this.props.course.page_index,
      pageSize: this.props.course.page_size,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize.bind(this),
      onChange: this.handleLoad.bind(this)
    };

    return (
      <QueueAnim>
        <div key="0">
          <Row className={style.layoutContentHeader}>
            <Col span={8}>
              <h1>课程列表</h1>
            </Col>
            <Col span={16} className={style.layoutContentHeaderMenu}>
              <Button type="default" icon="search" size="default" className={style.layoutContentHeaderMenuButton}
                      loading={this.props.course.is_load}
                      onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
              <Button type="default" icon="file-excel" size="default" className={style.layoutContentHeaderMenuButton}
                      onClick={this.handleExcel.bind(this)}>导出选课数据</Button>
              {/*<Upload className={style.layoutContentHeaderMenuButton} {...props}>*/}
              {/*<Button type="default" icon="upload" size="default" className="button-reload">导入课程数据</Button>*/}
              {/*</Upload>*/}
              {/*<Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}*/}
              {/*cancelText={constant.popconfirm_cancel}*/}
              {/*onConfirm={this.handleDeleteAll.bind(this)}>*/}
              {/*<Button type="default" icon="delete" size="default" className={style.layoutContentHeaderMenuButton}*/}
              {/*loading={this.props.course.is_load}>删除所有课程</Button>*/}
              {/*</Popconfirm>*/}
              <Button type="primary" icon="plus-circle" size="default"
                      onClick={this.handleSave.bind(this)}>{constant.save}</Button>
            </Col>
          </Row>
          <Form className={style.layoutContentHeaderSearch}>
            <Row>
              <Col span={8}>
                <FormItem hasFeedback {...constant.formItemLayout} className={style.formItem} label="名称">
                  {
                    getFieldDecorator('course_name', {
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
                 loading={this.props.course.is_load && !this.props.course.is_detail} columns={columns}
                 dataSource={this.props.course.list} pagination={pagination} scroll={{y: constant.scrollHeight()}}
                 bordered/>
          <CourseDetail is_load={this.props.course.is_load}
                        is_detail={this.props.course.is_detail}
                        clazz={this.state.clazz}
                        teacher={this.state.teacher}
                        white={this.state.white}
                        black={this.state.black}
                        handleSubmit={this.handleSubmit.bind(this)}
                        handleCancel={this.handleCancel.bind(this)}
                        handleWhiteSave={this.handleWhiteSave.bind(this)}
                        handleBlackSave={this.handleBlackSave.bind(this)}
                        handleStudentDelete={this.handleStudentDelete.bind(this)}
                        ref="detail"/>
        </div>
      </QueueAnim>
    );
  }
}

CourseIndex.propTypes = {};

CourseIndex = Form.create({})(CourseIndex);

export default connect(({course}) => ({
  course,
}))(CourseIndex);
