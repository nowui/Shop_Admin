import React, {Component, PropTypes} from 'react';
import {Row, Col, Button, Form, Input, Table, Upload, Select, Modal} from 'antd';

import constant from '../../constant/constant';
import http from '../../util/http';
import style from '../style.css';

let request;

class StudentHelp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: '',
      is_load: false,
      is_visible: false,
      is_preview: false,
      student_name: '',
      clazz_id: '',
      page_index: 1,
      page_size: 20,
      total: 0,
      list: [],
      selectedRowKeys: []
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    if (typeof(request) != 'undefined') {
      request.cancel();
    }
  }

  handleOpen(type) {
    this.setState({
      type: type,
      is_visible: true
    });

    if (this.state.list.length > 0) {
      return;
    }

    this.handleSearch();
  }

  handleSearch() {
    this.handleLoad(1);
  }

  handleLoad(page_index) {
    this.setState({
      is_load: true
    });

    request = http({
      url: '/student/admin/list',
      data: {
        student_name: this.props.form.getFieldValue('student_name'),
        clazz_id: this.props.form.getFieldValue('clazz_id'),
        page_index: page_index,
        page_size: 10
      },
      success: function (json) {
        for (let i = 0; i < json.data.length; i++) {
          json.data[i].key = json.data[i].student_id;
        }

        this.setState({
          page_index: page_index,
          total: json.total,
          list: json.data
        });
      }.bind(this),
      complete: function () {
        this.setState({
          is_load: false
        });
      }.bind(this)
    }).post();
  }

  handleCancel() {
    this.setState({
      is_visible: false,
      selectedRowKeys: []
    });
  }

  handleSubmit() {
    if (this.state.selectedRowKeys.length > 0) {
      this.props.handleSubmitReturn(this.state.selectedRowKeys[0], this.state.type);
    }

    this.handleCancel();
  }

  render() {
    const FormItem = Form.Item;
    const Option = Select.Option;
    const {getFieldDecorator} = this.props.form;

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
    }];

    const rowSelection = {
      type: 'radio',
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys: selectedRowKeys
        });
      }
    };

    const pagination = {
      total: this.state.total,
      current: this.state.page_index,
      pageSize: this.state.page_size,
      onChange: this.handleLoad.bind(this)
    };

    return (
      <Modal title="选择学生" visible={this.state.is_visible} maskClosable={false} width={constant.detail_width}
             onCancel={this.handleCancel.bind(this)}
             footer={[
               <Button key="back" type="ghost" size="default" icon="cross-circle"
                       onClick={this.handleCancel.bind(this)}>关闭</Button>,
               <Button key="submit" type="primary" size="default" icon="check-circle"
                       loading={this.state.is_load}
                       onClick={this.handleSubmit.bind(this)}>确定</Button>
             ]}
      >

        <Row className={style.layoutContentHeader}>
          <Col span={8}>
          </Col>
          <Col span={16} className={style.layoutContentHeaderMenu}>
            <Button type="default" icon="search" size="default" className={style.layoutContentHeaderMenuButton}
                    loading={this.state.is_load}
                    onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
          </Col>
        </Row>
        <Form className={style.layoutContentHeaderSearch}>
          <Row>
            <Col span={8}>
              <FormItem hasFeedback {...constant.formItemLayout} className={style.formItem} label="名称">
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
              <FormItem hasFeedback {...constant.formItemLayout} className={style.formItem} label="班级编号">
                {
                  getFieldDecorator('clazz_id', {
                    initialValue: ''
                  })(
                    <Select style={{
                      width: '100%'
                    }} placeholder="请选择班级">
                      {
                        this.props.clazz.map(function (item) {
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
               rowSelection={rowSelection}
               loading={this.state.is_load} columns={columns}
               dataSource={this.state.list} pagination={pagination} scroll={{y: constant.scrollHelpHeight()}}
               bordered/>
      </Modal>
    );
  }
}

StudentHelp.propTypes = {
  clazz: React.PropTypes.array.isRequired,
  handleSubmitReturn: React.PropTypes.func.isRequired
};

StudentHelp = Form.create({
  withRef: true
})(StudentHelp);

export default StudentHelp;
