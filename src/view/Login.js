import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {Card, message, Spin, Form, Input, Button} from 'antd';

import constant from '../util/constant';
import storage from '../util/storage';
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
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return;
      }

      this.setState({
        is_load: true
      });

      http.request({
        url: '/admin/login',
        data: values,
        success: function (json) {
          message.success("登录成功");

          storage.setToken(json.data.token);

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
      });
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
                initialValue: ''
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
                initialValue: ''
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
                    onClick={this.handleSubmit.bind(this)}>登录系统</Button>
          </FormItem>
        </Spin>
      </Card>
    );
  }
}

Login.propTypes = {};

Login = Form.create({})(Login);

export default connect(({}) => ({}))(Login);
