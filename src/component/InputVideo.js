import React, {Component, PropTypes} from 'react';
import {Modal, message} from 'antd';

import VideoHelp from './VideoHelp';
import constant from '../util/constant';
import notification from '../util/notification';
import style from './InputVideo.css';

class InputImage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list: []
    }
  }

  componentDidMount() {
    notification.on('notification_file_video_save', this, function (data) {
      let list = this.state.list;
      list.push({
        file_id: data.file_id,
        file_name: data.file_name,
        file_path: data.file_path,
        status: false
      })

      this.setState({
        list: list
      });
    });
  }

  componentWillUnmount() {
    notification.remove('notification_file_video_save', this);

  }

  handleSetList(list) {
    let array = [];

    for (let i = 0; i < list.length; i++) {
      array.push({
        file_id: list[i].file_id,
        file_name: list[i].file_name,
        file_path: list[i].file_path,
        status: false
      });
    }

    this.setState({
      list: array
    });
  }

  handleGetList() {
    return this.state.list;
  }

  handleDelete(file_id) {
    let index = -1;
    let list = this.state.list;

    for (let i = 0; i < list.length; i++) {
      if (list[i].file_id == file_id) {
        index = i;
      }
    }

    list.splice(index, 1);

    this.setState({
      list: list
    });
  }

  handleUpload() {
    this.refs.video.refs.wrappedComponent.refs.formWrappedComponent.handleOpen();
  }

  handleMouseOver(file_id) {
    let list = [];

    for (let i = 0; i < this.state.list.length; i++) {
      let item = this.state.list[i];

      list.push({
        file_id: item.file_id,
        file_name: item.file_name,
        file_path: item.file_path,
        status: item.file_id == file_id
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
        file_name: item.file_name,
        file_path: item.file_path,
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
        if (list[i].file_path == this.state.list[k].file_path) {
          isNotExit = false;

          break;
        }
      }

      if (isNotExit) {
        //list[i] = list[i].replace(Helper.host, '');

        if (array.length < this.props.limit) {
          array.push(list[i]);
        }
      }
    }

    this.setState({
      list: array
    });
  }

  handleReset() {
    this.setState({
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
              <div key={item.file_id} className={style.item}>
                <div className={style.itemImage}>{item.file_path}</div>
                <div onMouseOver={this.handleMouseOver.bind(this, item.file_id)}
                     onMouseOut={this.handleMouseOut.bind(this)}>
                  <div className={mask}></div>
                  <i className={"anticon anticon-eye-o " + style.itemPreviewIcon}
                     style={{display: item.status ? 'inline' : 'none'}}/>
                  <i className={"anticon anticon-delete " + style.itemRemoveIcon}
                     style={{display: item.status ? 'inline' : 'none'}}
                     onClick={this.handleDelete.bind(this, item.file_id)}/>
                </div>
              </div>
            )
          }.bind(this))
        }
        {
          this.state.list.length < this.props.limit ?
            <div className={style.button} onClick={this.handleUpload.bind(this)}>
              <i className={"anticon anticon-plus " + style.buttonIcon}/>
              <div className={"ant-upload-text " + style.buttonText}>添加图片</div>
            </div>
            :
            ''
        }
        <VideoHelp type={this.props.type} limit={this.props.limit} handleSubmitReturn={this.handleSubmitReturn.bind(this)} ref="video"/>
      </div>
    );
  }
}

InputImage.propTypes = {
  type: React.PropTypes.string,
  limit: React.PropTypes.number
};

InputImage.defaultProps = {
  type: '',
  limit: 0
};

export default InputImage;
