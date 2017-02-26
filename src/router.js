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

import ClazzIndex from './view/clazz/ClazzIndex';
import StudentIndex from './view/student/StudentIndex';
import TeacherIndex from './view/teacher/TeacherIndex';
import CourseIndex from './view/course/CourseIndex';
import ConfigIndex from './view/config/ConfigIndex';

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
        <IndexRedirect to="course/index"/>
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

          <Route path="clazz/index" component={ClazzIndex}/>
          <Route path="student/index" component={StudentIndex}/>
          <Route path="teacher/index" component={TeacherIndex}/>
          <Route path="course/index" component={CourseIndex}/>
          <Route path="config/index" component={ConfigIndex}/>
        </Route>
      </Route>
    </Router>
  );
}

export default RouterConfig;
