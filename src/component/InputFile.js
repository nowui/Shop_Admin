import React, {Component, PropTypes} from 'react';
import {Modal, message} from 'antd';

import FileHelp from './FileHelp';
import constant from '../util/constant';
import notification from '../util/notification';
import style from './InputFile.css';

class InputImage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list: []
    }
  }

  componentDidMount() {
    notification.on('notification_file_video_save', this, function (data) {
      var list = this.state.list;
      list.push({
        file_id: data.file_id,
        file_name: data.file_name,
        file_path: data.file_path,
        file_image: data.file_image,
        status: false
      })

      this.setState({
        list: list
      });
    });

    notification.on('notification_file_video_update', this, function (data) {
      var list = this.state.list;

      for (var i = 0; i < list.length; i++) {
        if (list[i].file_id == data.file_id) {
          list[i].file_name = data.file_name;
          list[i].file_path = data.file_path;
          list[i].file_image = data.file_image;
        }
      }

      this.setState({
        list: list
      });
    });
  }

  componentWillUnmount() {
    notification.remove('notification_file_video_save', this);

    notification.remove('notification_file_video_update', this);

  }

  handleSetList(list) {
    var array = [];

    for (var i = 0; i < list.length; i++) {
      array.push({
        file_id: list[i].file_id,
        file_name: list[i].file_name,
        file_path: list[i].file_path,
        file_image: list[i].file_image,
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

  handleEdit(file_id) {
    this.refs.video.refs.wrappedComponent.refs.formWrappedComponent.handleEdit(file_id);
  }

  handleDelete(file_id) {
    var index = -1;
    var list = this.state.list;

    for (var i = 0; i < list.length; i++) {
      if (list[i].file_id == file_id) {
        index = i;
      }
    }

    list.splice(index, 1);

    this.setState({
      list: list
    });
  }

  handleAdd() {
    this.refs.video.refs.wrappedComponent.refs.formWrappedComponent.handleAdd();
  }

  handleMouseOver(file_id) {
    var list = [];

    for (var i = 0; i < this.state.list.length; i++) {
      var item = this.state.list[i];

      list.push({
        file_id: item.file_id,
        file_name: item.file_name,
        file_path: item.file_path,
        file_image: item.file_image,
        status: item.file_id == file_id
      });
    }

    this.setState({
      list: list
    });
  }

  handleMouseOut(file_id) {
    var list = [];

    for (var i = 0; i < this.state.list.length; i++) {
      var item = this.state.list[i];

      list.push({
        file_id: item.file_id,
        file_name: item.file_name,
        file_path: item.file_path,
        file_image: item.file_image,
        status: false
      });
    }

    this.setState({
      list: list
    });
  }

  handleSubmitReturn(list) {
    var array = this.state.list;

    for (var i = 0; i < list.length; i++) {
      var isNotExit = true;

      for (var k = 0; k < this.state.list.length; k++) {
        if (list[i].file_id == this.state.list[k].file_id) {
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
                <div className={style.itemImage} style={{backgroundImage: 'url(' + constant.host + item.file_image + ')'}}></div>
                <div onMouseOver={this.handleMouseOver.bind(this, item.file_id)}
                     onMouseOut={this.handleMouseOut.bind(this)}>
                  <div className={mask}></div>
                  <i className={"anticon anticon-edit " + style.itemPreviewIcon}
                     style={{display: item.status ? 'inline' : 'none'}}
                     onClick={this.handleEdit.bind(this, item.file_id)}/>
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
            <div className={style.button} onClick={this.handleAdd.bind(this)}>
              <i className={"anticon anticon-plus " + style.buttonIcon}/>
              <div className={"ant-upload-text " + style.buttonText}>添加文件</div>
            </div>
            :
            ''
        }
        <FileHelp type={this.props.type} limit={this.props.limit} handleSubmitReturn={this.handleSubmitReturn.bind(this)} ref="video"/>
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
