import React, {Component, PropTypes} from 'react';
import {Modal, message} from 'antd';

import ImageHelp from './ImageHelp'
import constant from '../constant/constant';
import style from './InputImage.css';

class InputImage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_preview: false,
      image: '',
      list: []
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  handleSetList(list) {
    let array = [];

    for (let i = 0; i < list.length; i++) {
      array.push({
        url: list[i],
        status: false
      });
    }

    this.setState({
      list: array
    });
  }

  handleGetList() {
    let list = [];

    for (let i = 0; i < this.state.list.length; i++) {
      list.push(this.state.list[i].url);
    }

    return list;
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
    this.setState({
      is_preview: false
    });
  }

  handlePreview(url) {
    this.setState({
      image: constant.host + url,
      is_preview: true
    });
  }

  handleDelete(url) {
    let index = -1;
    let list = this.state.list;

    for (let i = 0; i < list.length; i++) {
      if (list[i] == url) {
        index = i;
      }
    }

    list.splice(index, 1);

    this.setState({
      list: list
    });
  }

  handleUpload() {
    this.refs.image.handleOpen();
  }

  handleChange(list) {
    this.setState({
      list: list
    });
  }

  handleMouseOver(url) {
    let list = [];

    for (let i = 0; i < this.state.list.length; i++) {
      let item = this.state.list[i];

      list.push({
        id: item.id,
        url: item.url,
        status: item.url == url
      });
    }

    this.setState({
      list: list
    });
  }

  handleMouseOut(url) {
    let list = [];

    for (let i = 0; i < this.state.list.length; i++) {
      let item = this.state.list[i];

      list.push({
        id: item.id,
        url: item.url,
        status: false
      });
    }

    this.setState({
      list: list
    });
  }

  handleSubmitReturn(list) {
    let array = this.state.list;

    for (let i = 0; i < list.length; i++) {
      let isNotExit = true;

      for (let k = 0; k < this.state.list.length; k++) {
        if (list[i].url == this.state.list[k].url) {
          isNotExit = false;

          break;
        }
      }

      if (isNotExit) {
        //list[i] = list[i].replace(Helper.host, '');

        array.push(list[i]);
      }
    }

    this.setState({
      list: array
    });
  }

  handleReset() {
    this.setState({
      is_preview: false,
      image: '',
      list: []
    });
  }

  render() {

    return (
      <div>
        {
          this.state.list.map(function (item) {
            const mask = item.status ? style.itemMask + ' ' + style.itemMaskActive : style.itemMask;
            return (
              <div key={item.url} className={style.item}>
                <img className={style.itemImage} src={constant.host + item.url}/>
                <div onMouseOver={this.handleMouseOver.bind(this, item.url)} onMouseOut={this.handleMouseOut.bind(this)}>
                  <div className={mask}></div>
                  <i className={"anticon anticon-eye-o " + style.itemPreviewIcon} style={{display: item.status ? 'inline' : 'none'}} onClick={this.handlePreview.bind(this, item.url)}/>
                  <i className={"anticon anticon-delete " + style.itemRemoveIcon} style={{display: item.status ? 'inline' : 'none'}} onClick={this.handleDelete.bind(this, item.url)}/>
                </div>
              </div>
            )
          }.bind(this))
        }
        <div className={style.button} onClick={this.handleUpload.bind(this)}>
          <i className={"anticon anticon-plus " + style.buttonIcon}/>
          <div className={"ant-upload-text " + style.buttonText}>添加图片</div>
        </div>
        <Modal visible={this.state.is_preview} footer={null} onCancel={this.handleCancel.bind(this)}>
          <img alt="example" style={{ width: '100%' }} src={this.state.image} />
        </Modal>
        <ImageHelp handleSubmitReturn={this.handleSubmitReturn.bind(this)} ref="image"/>
      </div>
    );
  }
}

InputImage.propTypes = {};

export default InputImage;
