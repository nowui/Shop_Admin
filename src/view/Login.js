import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {Card, message, Spin, Form, Input, Button} from 'antd';

import constant from '../constant/constant';
import database from '../util/database';
import http from '../util/http';
import style from './style.css';

class Login extends Component {
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

  handleSubmit() {
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }

      this.setState({
        is_load: true
      });

      http({
        url: '/admin/login',
        data: values,
        success: function (json) {
          message.success("登录成功");

          database.setToken(json.data.token);
          database.setMenu(json.data.menu);

          setTimeout(function () {
            this.props.dispatch(routerRedux.push({
              pathname: '/',
              query: {}
            }));
          }.bind(this), constant.timeout * 5);
        }.bind(this),
        complete: function () {
          this.setState({
            is_load: false
          });
        }.bind(this)
      }).post();
    });
  }

  render() {
    const FormItem = Form.Item;
    const {getFieldDecorator} = this.props.form;

    return (
      <Card className={style.loginForm}>
        <Spin spinning={this.state.is_load}>
          <FormItem hasFeedback className={style.formItem}>
            {
              getFieldDecorator('user_account', {
                rules: [{
                  required: true,
                  message: constant.required
                }],
                initialValue: 'admin'
              })(
                <Input type="text" placeholder={'用户名'}/>
              )
            }
          </FormItem>
          <FormItem hasFeedback className={style.formItem}>
            {
              getFieldDecorator('user_password', {
                rules: [{
                  required: true,
                  message: constant.required
                }],
                initialValue: 'admin'
              })(
                <Input type="password" placeholder={'密码'}/>
              )
            }
          </FormItem>
          <FormItem style={{
            marginBottom: '0px'
          }}>
            <Button type="primary" htmlType="submit" className={style.loginButton}
                    loading={this.state.is_load}
                    onClick={this.handleSubmit.bind(this)}>登录课程选课系统</Button>
          </FormItem>
        </Spin>
      </Card>
    );
  }
}

Login.propTypes = {};

Login = Form.create({})(Login);

export default connect(({}) => ({}))(Login);
