import React, { Component } from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import asyncComponent from '@/utils/asyncComponent';
import history from '@/utils/history';
import home from "@/pages/home/home";
const Fangtai=asyncComponent(() => import("@/pages/fangtai/Index"));

// react-router4 不再推荐将所有路由规则放在同一个地方集中式路由，子路由应该由父组件动态配置，组件在哪里匹配就在哪里渲染，更加灵活
export default class RouteConfig extends Component{
  render(){
    return(
      <Router history={history}>
        <Switch>
          <Route path="/" exact component={home} />
          <Route path="/ft" exact component={Fangtai} />
          <Redirect to="/" />
        </Switch>
      </Router>
    )
  }
}
