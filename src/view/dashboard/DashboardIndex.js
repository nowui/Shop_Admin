import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Icon} from 'antd';

import style from '../style.css';

class DashboardIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <QueueAnim>
        <div key="0">
          <Row className={style.layoutContentHeader}>
            <Col span={8}>
              <div className={style.layoutContentHeaderTitle}>仪表盘</div>
            </Col>
          </Row>
          <Row className={style.boxes}>
            <Col span={6} className={style.boxesCol}>
              <div className={style.boxesCircle} style={{
                borderColor: '#00c0ef',
                backgroundColor: '#00c0ef'
              }}>
                <Icon type="rocket" className={style.boxesIcon}/>
              </div>
              <h3 className={style.boxesText}>待发货订单</h3>
              <div className={style.boxesNumber}>0</div>
            </Col>
            <Col span={6} className={style.boxesCol}>
              <div className={style.boxesCircle} style={{
                borderColor: '#00a65a',
                backgroundColor: '#00a65a'
              }}>
                <Icon type="shopping-cart" className={style.boxesIcon}/>
              </div>
              <h3 className={style.boxesText}>昨日订单</h3>
              <div className={style.boxesNumber}>0</div>
            </Col>
            <Col span={6} className={style.boxesCol}>
              <div className={style.boxesCircle} style={{
                borderColor: '#f39c12',
                backgroundColor: '#f39c12'
              }}>
                <Icon type="pay-circle-o" className={style.boxesIcon}/>
              </div>
              <h3 className={style.boxesText}>昨日交易额</h3>
              <div className={style.boxesNumber}>0</div>
            </Col>
            <Col span={6} className={style.boxesCol}>
              <div className={style.boxesCircle} style={{
                borderColor: '#dd4b39',
                backgroundColor: '#dd4b39'
              }}>
                <Icon type="team" className={style.boxesIcon}/>
              </div>
              <h3 className={style.boxesText}>昨日注册用户</h3>
              <div className={style.boxesNumber}>0</div>
            </Col>
          </Row>
        </div>
      </QueueAnim>
    );
  }
}

DashboardIndex.propTypes = {};

export default connect(({}) => ({}))(DashboardIndex);
