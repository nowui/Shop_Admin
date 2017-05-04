import React, {Component, PropTypes} from 'react';
import {Modal, Button, message, Upload, Icon, Spin, Pagination} from 'antd';

import constant from '../util/constant';
import http from '../util/http';
import database from '../util/database';
import style from './ImageHelp.css';

let request;

class ImageHelp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false,
      is_visible: false,
      is_preview: false,
      image: '',
      list: [],
      page_index: 1,
      page_size: 36,
      total: 0
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    if (typeof(request) != 'undefined') {
      request.cancel();
    }
  }

  handleOpen() {
    this.setState({
      is_visible: true
    });

    // if (this.state.list.length > 0) {
    //   return;
    // }

    this.handleLoad(1);
  }

  handleLoad(page_index) {
    request = http({
      url: '/file/admin/list',
      data: {
        file_name: '',
        page_index: page_index,
        page_size: this.state.page_size
      },
      success: function (json) {
        let list = [];

        for (let i = 0; i < json.data.length; i++) {
          list.push({
            file_id: json.data[i].file_id,
            file_path: json.data[i].file_path,
            status: false,
            select: false
          });
        }

        this.setState({
          list: list,
          page_index: page_index,
          total: json.total
        });
      }.bind(this),
      complete: function () {

      }.bind(this)
    }).post();
  }

  handleBeforeUpload(file) {
    let result = true;

    if (file.type == 'image/jpeg' || file.type == 'image/jpg' || file.type == 'image/png') {

    } else {
      message.error('图片格式不对');

      result = false;
    }

    if (file.size > 1024 * 1024 * 2) {
      message.error('图片大小超过2M');

      result = false;
    }

    return result;
  }

  handleCancel() {
    let list = [];

    for (let i = 0; i < this.state.list.length; i++) {
      let item = this.state.list[i];

      list.push({
        file_id: item.file_id,
        file_path: item.file_path,
        status: false,
        select: false
      });
    }

    this.setState({
      is_visible: false,
      list: list
    });
  }

  handleCancelPreview() {
    this.setState({
      is_preview: false
    });
  }

  handlePreview(file_id) {
    let file_path = '';
    for (let i = 0; i < this.state.list.length; i++) {
      if (this.state.list[i].file_id == file_id) {
        file_path = this.state.list[i].file_path;
      }
    }

    this.setState({
      image: constant.host + file_path,
      is_preview: true
    });
  }

  handleClick(file_id) {
    let list = [];

    for (let i = 0; i < this.state.list.length; i++) {
      let item = this.state.list[i];

      if (item.file_id == file_id) {
        item.select = !item.select;
      }

      list.push({
        file_id: item.file_id,
        file_path: item.file_path,
        status: item.status,
        select: item.select
      });
    }

    this.setState({
      list: list
    });
  }

  handleMouseOver(file_id) {
    let list = [];

    for (let i = 0; i < this.state.list.length; i++) {
      let item = this.state.list[i];

      list.push({
        file_id: item.file_id,
        file_path: item.file_path,
        status: item.file_id == file_id,
        select: item.select
      });
    }

    this.setState({
      list: list
    });
  }

  handleMouseOut(file_id) {
    let list = [];

    for (let i = 0; i < this.state.list.length; i++) {
      let item = this.state.list[i];

      list.push({
        file_id: item.file_id,
        file_path: item.file_path,
        status: false,
        select: item.select
      });
    }

    this.setState({
      list: list
    });
  }

  handleSubmit() {
    let list = [];

    let index = 0;

    for (let i = 0; i < this.state.list.length; i++) {
      let item = this.state.list[i];

      if (item.select) {
        if (index < this.props.limit || this.props.limit == 0) {
          index++;

          if (this.props.type != '') {
            item.file_path = item.file_path.substring(0, item.file_path.lastIndexOf("/")) + "/" + this.props.type + "/" + item.file_path.substring(item.file_path.lastIndexOf("/") + 1);
          }

          list.push({
            file_id: item.file_id,
            file_path: item.file_path,
            status: false,
            select: item.select
          });
        }
      }
    }

    this.props.handleSubmitReturn(list);

    this.handleCancel();
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

  handlePaginationChange(page, pageSize) {
    this.handleLoad(page);
  }

  render() {
    const props = {
      name: 'file',
      multiple: true,
      showUploadList: false,
      action: constant.host + '/upload/image',
      accept: 'image/jpg,image/jpeg,image/png,image/gif',
      headers: {
        'Token': database.getToken(),
        'Platform': constant.platform,
        'Version': constant.version
      },
      onChange: this.handleChange.bind(this)
    };

    return (
      <Modal title="我的图片" visible={this.state.is_visible} maskClosable={false} width={constant.detail_width}
             onCancel={this.handleCancel.bind(this)}
             footer={[
               <div key="normal" style={{float: 'left', marginLeft: 10}}>
                 <Upload {...props}>
                   <Button type="ghost" loading={this.state.is_load}>
                     <Icon type="cloud-upload"/>上传图片
                   </Button>
                 </Upload>
               </div>,
               <Button key="back" type="ghost" size="default" icon="cross-circle"
                       onClick={this.handleCancel.bind(this)}>关闭</Button>,
               <Button key="submit" type="primary" size="default" icon="check-circle"
                       loading={this.state.is_load}
                       onClick={this.handleSubmit.bind(this)}>确定</Button>
             ]}
      >

        <Spin spinning={this.state.is_load}>
          {
            this.state.list.map(function (item) {
              const mask = item.status || item.select ? style.itemMask + ' ' + style.itemMaskActive : style.itemMask;
              return (
                <div key={item.file_id} className={style.item}>
                  <div className={style.itemImage} style={{backgroundImage: 'url(' + constant.host + item.file_path + ')'}}></div>
                  <div onMouseOver={this.handleMouseOver.bind(this, item.file_id)} onMouseOut={this.handleMouseOut.bind(this, item.file_id)}>
                    <div className={mask} onClick={this.handleClick.bind(this, item.file_id)}></div>
                    <i className={"anticon anticon-eye-o " + style.itemPreviewIcon} style={{display: item.status && !item.select ? 'inline' : 'none'}} onClick={this.handlePreview.bind(this, item.file_id)}/>
                    <i className={"anticon anticon-delete " + style.itemRemoveIcon} style={{display: item.status && !item.select ? 'inline' : 'none'}} />
                    <i className={"anticon anticon-check-circle-o " + style.itemCheckIcon} style={{display: item.select ? 'inline' : 'none'}} onClick={this.handlePreview.bind(this)}/>
                  </div>
                </div>
              )
            }.bind(this))
          }
          <div style={{float: 'left', width: '100%', textAlign: 'right'}}>
            <Pagination current={this.state.page_index} pageSize={this.state.page_size} total={this.state.total} onChange={this.handlePaginationChange.bind(this)} />
          </div>
        </Spin>
        <Modal visible={this.state.is_preview} footer={null} onCancel={this.handleCancelPreview.bind(this)}>
          <img alt="example" style={{ width: '100%' }} src={this.state.image} />
        </Modal>
      </Modal>
    );
  }
}

ImageHelp.propTypes = {
  type: React.PropTypes.string,
  limit: React.PropTypes.number.isRequired,
  handleSubmitReturn: React.PropTypes.func.isRequired
};

ImageHelp.defaultProps = {
  type: ''
};

export default ImageHelp;
