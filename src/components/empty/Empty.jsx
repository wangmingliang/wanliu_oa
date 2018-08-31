import React, { Component } from 'react';
import './empty.scss';

export default class Empty extends Component{
  render(){
    return (
      <div className="empty_box">
        <div className="cont">
          <i className="ico"></i>
          <div className="desc">{this.props.desc}</div>
        </div>
      </div>
    );
  }
}
