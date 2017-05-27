import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux, Link} from 'dva/router';
import {Layout, Menu, Icon} from 'antd';

import constant from '../util/constant';
import database from '../util/database';
import request from '../util/request';
import style from './style.css';

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: false,
      menu: [],
      openKeys: [],
      selectedKeys: []
    }
  }

  componentDidMount() {
    request.post({
      url: '/admin/menu',
      data: {

      },
      success: function (json) {
        var menu = json.data;

        var open_key = [];
        var selected_key = [];

        for (var i = 0; i < menu.length; i++) {
          for (var k = 0; k < menu[i].children.length; k++) {
            if (menu[i].children[k].category_value == '/' + this.props.routes[2].path) {
              open_key = [menu[i].category_id];
              selected_key = [menu[i].children[k].category_id];

              break;
            }
          }
        }

        this.setState({
          menu: menu,
          openKeys: open_key,
          selectedKeys: selected_key
        });
      }.bind(this),
      complete: function () {

      }.bind(this)
    });
  }

  componentWillUnmount() {

  }

  handleToggle() {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  handleOpenChange(openKeys) {
    const state = this.state;
    const latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1));
    const latestCloseKey = state.openKeys.find(key => !(openKeys.indexOf(key) > -1));

    let nextOpenKeys = [];
    if (latestOpenKey) {
      nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
    }
    if (latestCloseKey) {
      nextOpenKeys = this.getAncestorKeys(latestCloseKey);
    }

    this.setState({
      openKeys: nextOpenKeys,
    });
  }

  getAncestorKeys = (key) => {
    const map = {
      sub3: [],
    };
    return map[key] || [];
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
        <Header className={style.layoutHeader}>
          <div className={style.logo}><h1
            onClick={this.handleLogo.bind(this)}>{constant.name}</h1>
          </div>
          {/*<Icon*/}
            {/*className={style.trigger}*/}
            {/*type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}*/}
            {/*onClick={this.handleToggle.bind(this)}*/}
          {/*/>*/}
          {/*<Badge count={5} className={style.notification} style={{boxShadow: 'none'}}>*/}
            {/*<Link to=''><Icon type="notification" className={style.notificationMessage}/></Link>*/}
          {/*</Badge>*/}
          {/*<Link to=''><Icon type="user" className={style.user}/></Link>*/}
          <Link onClick={this.handleLogout.bind(this)}><Icon type="poweroff" className={style.logout}/></Link>
        </Header>
        <Layout>
          <Sider
            collapsible
            onCollapse={this.handleToggle.bind(this)}
            collapsed={this.state.collapsed}
            style={{background: '#ffffff'}}
          >
            <div className={this.state.collapsed ? '' : style.layoutSider}>
              <Menu
                mode={this.state.collapsed ? 'vertical' : 'inline'}
                openKeys={this.state.openKeys}
                selectedKeys={this.state.selectedKeys}
                onOpenChange={this.handleOpenChange.bind(this)}
                onClick={this.handleClick.bind(this)}
                style={{height: document.documentElement.clientHeight - 60, paddingTop: '10px'}}
              >
                {
                  this.state.menu.map(function (item) {
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
          <Content style={{height: document.documentElement.clientHeight - 60}}
                   className={style.layoutContent}>
            {this.props.children}
          </Content>
          {/*<Footer className={style.layoutFooter}>*/}
          {/*Copyright ©2017 Created by XingXiao*/}
          {/*</Footer>*/}
        </Layout>
      </Layout>
    );
  }
}

Main.propTypes = {};

export default connect(({}) => ({}))(Main);
