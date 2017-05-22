import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Input, Table, message} from 'antd';

import constant from '../../util/constant';
import http from '../../util/http';
import style from '../style.css';

let request;

class CodeIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {
    this.props.form.setFieldsValue(this.props.code);

    this.handleSearch();
  }

  componentWillUnmount() {
    request.cancel();
  }

  handleSearch() {
    let page_index = 1;

    this.handList(page_index);
  }

  handLoad(page_index) {
    this.handList(page_index);
  }

  handList(page_index) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request = http({
      url: '/code/list',
      data: {
        page_index: page_index,
        page_size: this.props.code.page_size
      },
      success: function (json) {
        for (let i = 0; i < json.data.length; i++) {
          json.data[i].key = json.data[i].table_name;
        }

        this.props.dispatch({
          type: 'code/fetch',
          data: {
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

  handSave() {
    this.props.dispatch({
      type: 'code/fetch',
      data: {
        is_modal: true,
        action: 'save'
      }
    });
  }

  handUpdate(table_name) {
    let name_space = this.props.form.getFieldValue('name_space');

    this.props.dispatch({
      type: 'code/fetch',
      data: {
        name_space: name_space
      }
    });

    if (this.handleStart({
        is_load: true,
        is_modal: true,
        action: 'update'
      })) {
      return;
    }

    request = http({
      url: '/code/save',
      data: {
        name_space: name_space,
        table_name: table_name
      },
      success: function (json) {
        message.success(constant.success);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleDelete(code_id) {
    if (this.handleStart({
        is_load: true
      })) {
      return;
    }

    request = http({
      url: '/code/delete',
      data: {
        code_id: code_id
      },
      success: function (json) {
        message.success(constant.success);

        setTimeout(function () {
          this.handLoad(this.props.code.page_index);
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

    if (this.props.code.action == 'update') {
      data.code_id = this.props.code.code_id;
    }

    request = http({
      url: '/code/' + this.props.code.action,
      data: data,
      success: function (json) {
        message.success(constant.success);

        this.handleCancel();

        setTimeout(function () {
          this.handLoad(this.props.code.page_index);
        }.bind(this), constant.timeout);
      }.bind(this),
      complete: function () {
        this.handleFinish();
      }.bind(this)
    }).post();
  }

  handleCancel() {
    this.props.dispatch({
      type: 'code/fetch',
      data: {
        is_modal: false
      }
    });

    this.refs.detail.resetFields();
  }

  handleStart(data) {
    if (this.props.code.is_load) {
      return true;
    }

    this.props.dispatch({
      type: 'code/fetch',
      data: data
    });

    return false;
  }

  handleFinish() {
    this.props.dispatch({
      type: 'code/fetch',
      data: {
        is_load: false
      }
    });
  }

  handleChangeSize(page_index, page_size) {
    this.props.dispatch({
      type: 'code/fetch',
      data: {
        page_size: page_size
      }
    });

    setTimeout(function () {
      this.handLoad(page_index);
    }.bind(this), constant.timeout);
  }

  render() {
    const FormItem = Form.Item;
    const {getFieldDecorator} = this.props.form;

    const columns = [{
      title: '数据库名称',
      dataIndex: 'table_name'
    }, {
      width: 90,
      title: constant.action,
      dataIndex: '',
      render: (text, record, index) => (
        <span>
          <a onClick={this.handUpdate.bind(this, record.table_name)}>执行</a>
        </span>
      )
    }];

    const pagination = {
      size: 'defalut',
      total: this.props.code.total,
      showTotal: function (total, range) {
        return '总共' + total + '条数据';
      },
      current: this.props.code.page_index,
      pageSize: this.props.code.page_size,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize.bind(this),
      onChange: this.handLoad.bind(this)
    };

    return (
      <QueueAnim>
        <div key="0">
          <Row className={style.layoutContentHeader}>
            <Col span={8}>
              <div className={style.layoutContentHeaderTitle}>代码生成</div>
            </Col>
            <Col span={16} className={style.layoutContentHeaderMenu}>
              <Button type="default" icon="search" size="default" className={style.layoutContentHeaderMenuButton}
                      loading={this.props.code.is_load}
                      onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
              <Button type="primary" icon="plus-circle" size="default"
                      onClick={this.handSave.bind(this)}>{constant.save}</Button>
            </Col>
          </Row>
          <Form className={style.layoutContentHeaderSearch}>
            <Row>
              <Col span={8}>
                <FormItem hasFeedback {...constant.formItemLayout} className={style.formItem} label="命名空间">
                  {
                    getFieldDecorator('name_space', {
                      initialValue: ''
                    })(
                      <Input type="text" placeholder="请输入命名空间" className={style.formItemInput}/>
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
          <Table size="middle" className={style.layoutContentHeaderTable}
                 loading={this.props.code.is_load && !this.props.code.is_detail} columns={columns}
                 dataSource={this.props.code.list} pagination={pagination} scroll={{y: constant.scrollHeight()}}
                 bordered/>
        </div>
      </QueueAnim>
    );
  }
}

CodeIndex.propTypes = {};

CodeIndex = Form.create({})(CodeIndex);

export default connect(({code}) => ({
  code,
}))(CodeIndex);
