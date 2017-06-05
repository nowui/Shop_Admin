import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Input, Table, Upload, Icon, message} from 'antd';

import FileDetail from './FileDetail';
import constant from '../../util/constant';
import storage from '../../util/storage';
import notification from '../../util/notification';
import http from '../../util/http';
import style from '../style.css';


class FileIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false
    }
  }

  componentDidMount() {
    this.props.form.setFieldsValue({
      file_name: this.props.file.file_name
    });

    this.handleLoad();

    notification.on('notification_file_index_load', this, function (data) {
      this.handleLoad();
    });
  }

  componentWillUnmount() {
    notification.remove('notification_file_index_load', this);
  }

  handleSearch() {
    new Promise(function (resolve, reject) {
      this.props.dispatch({
        type: 'file/fetch',
        data: {
          file_name: this.props.form.getFieldValue('file_name'),
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
      url: '/file/admin/list',
      data: {
        file_name: this.props.file.file_name,
        page_index: this.props.file.page_index,
        page_size: this.props.file.page_size
      },
      success: function (json) {
        this.props.dispatch({
          type: 'file/fetch',
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
        type: 'file/fetch',
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
        type: 'file/fetch',
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
    notification.emit('notification_file_detail_save', {});
  }

  handleUpdate(file_id) {
    notification.emit('notification_file_detail_update', {
      file_id: file_id
    });
  }

  handleDelete(file_id) {
    this.setState({
      is_load: true
    });

    http.request({
      url: '/file/delete',
      data: {
        file_id: file_id
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

      this.handleLoad(1);
    } else if (info.file.status == 'uploading') {
      this.setState({
        is_load: true
      });
    } else if (info.file.status === 'error') {
      message.error(info.file.name + ' file upload failed');
    }
  }

  render() {
    const FormItem = Form.Item;
    const {getFieldDecorator} = this.props.form;

    const columns = [{
      title: '路径',
      dataIndex: 'file_path'
    }, {
      width: 90,
      title: constant.action,
      dataIndex: '',
      render: (text, record, index) => (
        <span>
          <a onClick={this.handleUpdate.bind(this, record.file_id)}>{constant.find}</a>
        </span>
      )
    }];

    const pagination = {
      size: 'defalut',
      total: this.props.file.total,
      showTotal: function (total, range) {
        return '总共' + total + '条数据';
      },
      current: this.props.file.page_index,
      pageSize: this.props.file.page_size,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize.bind(this),
      onChange: this.handleChangeIndex.bind(this)
    };

    const props = {
      name: 'file',
      multiple: true,
      showUploadList: false,
      action: constant.host + '/file/admin/upload',
      headers: {
        'Token': storage.getToken(),
        'Platform': constant.platform,
        'Version': constant.version
      },
      onChange: this.handleChange.bind(this)
    };

    return (
      <QueueAnim>
        <div key="0">
          <Row className={style.layoutContentHeader}>
            <Col span={8}>
              <div className={style.layoutContentHeaderTitle}>文件列表</div>
            </Col>
            <Col span={16} className={style.layoutContentHeaderMenu}>
              <Button type="default" icon="search" size="default" className={style.layoutContentHeaderMenuButton}
                      loading={this.state.is_load}
                      onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
              <Upload {...props}>
                <Button type="primary" loading={this.state.is_load}>
                  <Icon type="cloud-upload"/>上传文件
                </Button>
              </Upload>
            </Col>
          </Row>
          <Form className={style.layoutContentHeaderSearch}>
            <Row>
              <Col span={8}>
                <FormItem hasFeedback {...constant.formItemLayout} className={style.formSearchItem} label="名称">
                  {
                    getFieldDecorator('file_name', {
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
          <Table rowKey="file_id"
                 className={style.layoutContentHeaderTable}
                 loading={this.state.is_load} columns={columns}
                 dataSource={this.props.file.list} pagination={pagination}
                 bordered/>
          <FileDetail/>
        </div>
      </QueueAnim>
    );
  }
}

FileIndex.propTypes = {};

FileIndex = Form.create({})(FileIndex);

export default connect(({file}) => ({
  file
}))(FileIndex);
