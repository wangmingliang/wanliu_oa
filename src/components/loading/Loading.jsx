import React, { Component } from 'react';
import * as gif from "./images/loading.gif";
import "./loading.scss";
/**
 * 点击状态组件
 */
export default class Loading extends Component{
  render(){
    return (
      <div className="page_loading_view">
        <img src={gif} alt=""/>
      </div>
    );
  }
}
