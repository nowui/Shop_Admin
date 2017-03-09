import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux, Link} from 'dva/router';
import {Layout, Menu, Icon, Badge} from 'antd';

import database from '../util/database';
import style from './style.css';

class Main extends Component {
  constructor(props) {
    super(props);

    let open_key = [];
    let selected_key = [];

    for (let i = 0; i < database.getMenu().length; i++) {
      for (let k = 0; k < database.getMenu()[i].children.length; k++) {
        if (database.getMenu()[i].children[k].category_value == '/' + this.props.routes[2].path) {
          open_key = [database.getMenu()[i].category_id];
          selected_key = [database.getMenu()[i].children[k].category_id];

          break
        }
      }
    }

    this.state = {
      collapsed: false,
      openKeys: open_key,
      selectedKeys: selected_key
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  handleToggle() {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  handleClick(item) {
    this.setState({
      selectedKeys: [item.key]
    });
  }

  handleLogo() {
    this.setState({
      selectedKeys: []
    });

    this.props.dispatch(routerRedux.push({
      pathname: '/dashboard/index',
      query: {}
    }));
  }

  handleLogout() {
    database.setToken('');
    database.setMenu([]);

    this.props.dispatch(routerRedux.push({
      pathname: '/login',
      query: {}
    }));
  }

  render() {
    const {Header, Sider, Content, Footer} = Layout;
    const SubMenu = Menu.SubMenu;

    return (
      <Layout>
        <Sider
          onCollapse={this.handleToggle.bind(this)}
          collapsed={this.state.collapsed}
        >
          <div className={this.state.collapsed ? '' : style.layoutSider}>
            <div className="logo"><h1 onClick={this.handleLogo.bind(this)}>{this.state.collapsed ? '商城' : '微信商城'}</h1>
            </div>
            <Menu
              theme="dark"
              mode={this.state.collapsed ? 'vertical' : 'inline'}
              defaultOpenKeys={this.state.openKeys}
              selectedKeys={this.state.selectedKeys}
              onClick={this.handleClick.bind(this)}
            >
              {
                database.getMenu().map(function (item) {
                  return (
                    <SubMenu key={item.category_id}
                             title={<span><Icon
                               className={'anticon ' + item.category_remark}/><span
                               className="nav-text">{item.category_name}</span></span>}>
                      {
                        item.children.map(function (children) {
                          return (
                            <Menu.Item key={children.category_id}><Link
                              to={children.category_value}>{children.category_name}</Link></Menu.Item>
                          )
                        })
                      }
                    </SubMenu>
                  )
                })
              }
            </Menu>
          </div>
        </Sider>
        <Layout>
          <Header className={style.layoutHeader}>
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.handleToggle.bind(this)}
            />
            <Badge count={5} className={style.notification}>
              <Link to=''><Icon type="notification" className={style.notificationMessage}/></Link>
            </Badge>
            <Link to=''><Icon type="user" className={style.user}/></Link>
            <Link onClick={this.handleLogout.bind(this)}><Icon type="poweroff" className={style.logout}/></Link>
          </Header>
          <Content style={{height: document.documentElement.clientHeight - 60 - 20 - 20}}
                   className={style.layoutContent}>
            {this.props.children}
          </Content>
          <Footer className={style.layoutFooter}>
            Copyright ©2017 Created by XingXiao
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

Main.propTypes = {};

export default connect(({}) => ({}))(Main);
