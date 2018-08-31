import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { is, fromJS } from 'immutable';
// import PropTypes from 'prop-types';
// import API from '@/api/api';
// import envconfig from '@/envconfig/envconfig';
import history from '../../utils/history';
import moment from "moment";
import mixin, { padStr } from '@/utils/mixin';
import './sass/home.scss';
import { Link } from "react-router-dom";
import { WhiteSpace, Flex, Icon, InputItem, Button } from 'antd-mobile';
import { getInfo } from './homeData'

@mixin({ padStr })
class Home extends Component {
  static contextTypes = {
    // router: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentWillReceiveProps(nextProps) {
    // if(!is(fromJS(this.props.proData), fromJS(nextProps.proData))){
    //   this.initData(nextProps);
    // }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
  // }

  componentWillMount() {
    console.log(moment().endOf('day').fromNow())
  }
  componentDidMount() {
    // history.push("/code");
    // getInfo(2).then(data => {
    //   console.log(data)
    //   this.setState({ pager: data.data });
    // })
  }


  render() {
    return (
      <div className="home-view">
        ========<Link to="/ft">跳转房态</Link>
      </div>
    );
  }
}

export default connect(state => ({
  // formData: state.formData,
  // proData: state.proData,
}), {
    // saveFormData,
  })(Home);
