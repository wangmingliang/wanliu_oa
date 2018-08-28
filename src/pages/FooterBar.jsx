import React, { Component } from 'react';
import { connect } from 'react-redux';
import { is, fromJS } from 'immutable';
import { TabBar } from 'antd-mobile';
// import PropTypes from 'prop-types';
import history from '../utils/history';

class FooterBar extends Component {
  // static contextTypes = {
  //   router: PropTypes.object.isRequired
  // };

  constructor(props) {
    super(props);
    this.state = {
      selectedTab:'home',
      list:[
        {
          icon_default:'&#xe605;',
          icon_selected:"&#xe605;",
          title: "首页",
          key: "home",
          link: "/"
        },
        {
          icon_default:"&#xe62a;",
          icon_selected:"&#xe62a;",
          title: "俱乐部",
          key: "club",
          link: "/club"
        },
        {
          icon_default:"&#xe71a;",
          icon_selected:"&#xe71a;",
          title: "积分商城",
          key: "integral",
          link: "/integral"
        },
        {
          icon_default:"&#xe650;",
          icon_selected:"&#xe650",
          title: "我的推广",
          key: "promote",
          link: "/promote"
        },
        {
          icon_default:"&#xe629;",
          icon_selected:"&#xe629;",
          title: "我的",
          key: "my",
          link: "/my"
        }
      ]
    };
  }
  initData = props => {
    if(props.list&&typeof(props.list)==='array'){
      this.setState({list:props.list});
    }
  }

  componentWillReceiveProps(nextProps){
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
  }

  componentWillMount(){
    this.setState({
      selectedTab: window.location.pathname,
    });
    
    this.initData(this.props);
  }
  componentDidMount(){

  }
  changeTab(item){
    if(item.link.replace(/\?.*$/, '') !== this.state.selectedTab){
      history.push(item.link);
    }
  }
  choosed(link){
    return link.replace(/\?.*$/, '') === this.state.selectedTab;
  }
  render() {
    return (
      <div>
        <div style={{ position: 'fixed', width: '100%', bottom: 0 }}>
          <TabBar
            unselectedTintColor="#464646"
            tintColor="#ff6f7d"
            barTintColor="white"
            tabBarPosition="bottom"
          >
            {
              this.state.list.map((item, index) => {
                return (<TabBar.Item
                  icon={
                    // <i className="iconfont"></i>
                    <div className="iconfont" style={{
                      width: '24px',
                      height: '24px',
                      fontSize:'22px'
                    }} 
                      dangerouslySetInnerHTML={{__html: item.icon_default}} 
                    ></div>
                  }
                  selectedIcon={
                    <div className="iconfont" style={{
                      width: '24px',
                      height: '24px', 
                      color: '#ff6f7d',
                      fontSize:'22px'
                    }}
                      dangerouslySetInnerHTML={{__html: item.icon_selected}} 
                    ></div>
                  }
                  title={item.title}
                  key={item.key}
                  // badge={'new'}
                  selected={this.choosed(item.link)}
                  onPress={() => {
                    this.changeTab(item);
                  }}
                  data-seed={"logId"+index}
                >
                </TabBar.Item>)
              })
            }
          </TabBar>
        </div>
      </div>
    );
  }
}

export default connect(state => ({}))(FooterBar);
