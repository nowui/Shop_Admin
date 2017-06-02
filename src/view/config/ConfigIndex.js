import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Spin, message} from 'antd';

import constant from '../../util/constant';
import http from '../../util/http';
import style from '../style.css';


class ConfigIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  handleDeleteCache() {
    this.setState({
      is_load: true
    });

    http.request({
      url: '/config/admin/cache/delete',
      data: {

      },
      success: function (json) {
        message.success(constant.success);
      }.bind(this),
      complete: function () {
        this.setState({
          is_load: false
        });
      }.bind(this)
    });
  }

  render() {
    return (
      <QueueAnim>
        <Spin spinning={this.state.is_load}>
          <div key="0">
            <Row className={style.layoutContentHeader}>
              <Col span={8}>
                <div className={style.layoutContentHeaderTitle}>系统配置</div>
              </Col>
              <Col span={16} className={style.layoutContentHeaderMenu}>
                <Button type="primary" icon="plus-circle" size="default"
                        onClick={this.handleDeleteCache.bind(this)}>删除缓存</Button>
              </Col>
            </Row>
          </div>
        </Spin>
      </QueueAnim>
    );
  }
}

ConfigIndex.propTypes = {};

ConfigIndex = Form.create({})(ConfigIndex);

export default connect(({config}) => ({
  config
}))(ConfigIndex);
