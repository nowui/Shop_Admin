import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Spin, Button, Tree, message} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';
import style from '../style.css';

class RoleResource extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false,
      is_show: false,
      role_id: '',
      list: [],
      expandedKeys: [],
      checkedKeys: []
    }
  }

  componentDidMount() {
    notification.on('notification_role_resource_update', this, function (data) {
      this.setState({
        is_show: true,
        role_id: data.role_id
      });

      this.handleLoad(data.role_id);
    });
  }

  componentWillUnmount() {
    notification.remove('notification_role_resource_update', this);
  }

  handleLoad(role_id) {
    this.setState({
      is_load: true
    });

    http.request({
      url: '/role/admin/resource/find',
      data: {
        role_id: role_id
      },
      success: function (json) {
        var expandedKeys = this.getExpandedKeys(json.data);
        var checkedKeys = this.getCheckedKeys(json.data);

        this.setState({
          list: json.data,
          expandedKeys: expandedKeys,
          checkedKeys: checkedKeys
        });
      }.bind(this),
      complete: function () {
        this.setState({
          is_load: false
        });

      }.bind(this)
    });
  }

  getExpandedKeys(list) {
    var expandedKeys = [];

    for (var i = 0; i < list.length; i++) {
      expandedKeys.push(list[i].category_id);

      if (list[i].children) {
        expandedKeys = expandedKeys.concat(this.getExpandedKeys(list[i].children));
      }
    }

    return expandedKeys;
  }

  getCheckedKeys(list) {
    var checkedKeys = [];

    for (var i = 0; i < list.length; i++) {
      if (list[i].children) {
        checkedKeys = checkedKeys.concat(this.getCheckedKeys(list[i].children));
      } else {
        if (list[i].is_check) {
          checkedKeys.push(list[i].category_id);
        }
      }
    }

    return checkedKeys;
  }

  getResourceKeys(list, checkedKeys) {
    var resourceKeys = [];

    for (var i = 0; i < list.length; i++) {
      if (list[i].children) {
        resourceKeys = resourceKeys.concat(this.getResourceKeys(list[i].children, checkedKeys));
      } else {
        if (list[i].is_leaf) {
          for (var j = 0; j < checkedKeys.length; j++) {
            if (list[i].category_id == checkedKeys[j]) {
              resourceKeys.push(list[i].category_id);

              break;
            }
          }
        }
      }
    }

    return resourceKeys;
  }

  handleCheck(checkedKeys) {
    this.setState({
      checkedKeys: checkedKeys
    });
  }

  handleSubmit() {
    var resource_id_list = this.getResourceKeys(this.state.list, this.state.checkedKeys);

    this.setState({
      is_load: true
    });

    http.request({
      url: '/role/admin/resource/save',
      data: {
        role_id: this.state.role_id,
        resource_id_list: resource_id_list
      },
      success: function (json) {
        message.success(constant.success);

        this.handleCancel();
      }.bind(this),
      complete: function () {
        this.setState({
          is_load: false
        });
      }.bind(this)
    });
  }

  handleCancel() {
    this.setState({
      is_show: false,
      checkedKeys: []
    });
  }

  render() {
    const TreeNode = Tree.TreeNode;

    const loop = data => data.map((item) => {
      if (item.children) {
        return (
          <TreeNode key={item.category_id} title={item.category_name}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.category_id} title={item.category_name} isLeaf={item.isLeaf}/>;
    });

    return (
      <Modal title={'角色权限表单'} maskClosable={false} width={constant.detail_width}
             visible={this.state.is_show} onCancel={this.handleCancel.bind(this)}
             footer={[
               <Button key="back" type="ghost" size="default" icon="cross-circle"
                       onClick={this.handleCancel.bind(this)}>关闭</Button>,
               <Button key="submit" type="primary" size="default" icon="check-circle"
                       loading={this.state.is_load}
                       onClick={this.handleSubmit.bind(this)}>确定</Button>
             ]}
      >
        <Spin spinning={this.state.is_load}>
          {
            this.state.list.length > 0 ?
              <Tree
                showLine
                checkable
                expandedKeys={this.state.expandedKeys}
                checkedKeys={this.state.checkedKeys}
                onCheck={this.handleCheck.bind(this)}
              >
                {loop(this.state.list)}
              </Tree>
              :
              ''
          }

        </Spin>
      </Modal>
    );
  }
}

RoleResource.propTypes = {};

export default connect(({role}) => ({
  role
}))(RoleResource);
