import React from 'react';
import {Router, Route, IndexRedirect} from 'dva/router';
import Login from './view/Login';
import Main from './view/Main';
import DashboardIndex from './view/dashboard/DashboardIndex';
import CodeIndex from './view/code/CodeIndex';
import RoleIndex from './view/role/RoleIndex';
import CategoryIndex from './view/category/CategoryIndex';
import AdminIndex from './view/admin/AdminIndex';
import AuthorizationIndex from './view/authorization/AuthorizationIndex';
import AttributeIndex from './view/attribute/AttributeIndex';
import LogIndex from './view/log/LogIndex';
import ResourceIndex from './view/resource/ResourceIndex';
import FileIndex from './view/file/FileIndex';

import BrandIndex from './view/brand/BrandIndex';
import ProductIndex from './view/product/ProductIndex';

import database from './util/database';

function RouterConfig({history}) {

  const validate = function (next, replace, callback) {
    if ((database.getToken() == '' || database.getToken() == null) && next.location.pathname != '/login') {
      replace('/login');
    }

    callback();
  };

  return (
    <Router history={history}>
      <Route path="/">
        <IndexRedirect to="code/index"/>
        <Route path="login" component={Login}/>
        <Route component={Main} onEnter={validate}>
          <Route path="dashboard/index" component={DashboardIndex}/>
          <Route path="code/index" component={CodeIndex}/>
          <Route path="role/index" component={RoleIndex}/>
          <Route path="category/index" component={CategoryIndex}/>
          <Route path="admin/index" component={AdminIndex}/>
          <Route path="authorization/index" component={AuthorizationIndex}/>
          <Route path="attribute/index" component={AttributeIndex}/>
          <Route path="log/index" component={LogIndex}/>
          <Route path="resource/index" component={ResourceIndex}/>
          <Route path="file/index" component={FileIndex}/>

          <Route path="brand/index" component={BrandIndex}/>
          <Route path="product/index" component={ProductIndex}/>
        </Route>
      </Route>
    </Router>
  );
}

export default RouterConfig;
