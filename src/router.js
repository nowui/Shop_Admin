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
import DeliveryIndex from './view/delivery/DeliveryIndex';
import MemberIndex from './view/member/MemberIndex';
import MemberTreeIndex from './view/member/MemberTreeIndex';
import MemberLevelIndex from './view/member/MemberLevelIndex';
import OrderIndex from './view/order/OrderIndex';
import SupplierIndex from './view/supplier/SupplierIndex';
import SceneIndex from './view/scene/SceneIndex';
import BillIndex from './view/bill/BillIndex';
import CartIndex from './view/cart/CartIndex';
import ExpressIndex from './view/express/ExpressIndex';

import ArticleIndex from './view/article/ArticleIndex';

import storage from './util/storage';

function RouterConfig({history}) {

  const validate = function (next, replace, callback) {
    if ((storage.getToken() == '' || storage.getToken() == null) && next.location.pathname != '/login') {

      replace('/login');
    }

    callback();
  };

  return (
    <Router history={history}>
      <Route path="/">
        <IndexRedirect to="dashboard/index"/>
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
          <Route path="delivery/index" component={DeliveryIndex}/>
          <Route path="member/index" component={MemberIndex}/>
          <Route path="member/tree/index" component={MemberTreeIndex}/>
          <Route path="member/level/index" component={MemberLevelIndex}/>
          <Route path="order/index" component={OrderIndex}/>
          <Route path="supplier/index" component={SupplierIndex}/>
          <Route path="scene/index" component={SceneIndex}/>
          <Route path="bill/index" component={BillIndex}/>
          <Route path="cart/index" component={CartIndex}/>
          <Route path="express/index" component={ExpressIndex}/>

          <Route path="article/index" component={ArticleIndex}/>
        </Route>
      </Route>
    </Router>
  );
}

export default RouterConfig;
