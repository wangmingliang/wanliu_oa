import React, { Component } from 'react';
import { connect } from 'react-redux';
import { is, fromJS } from 'immutable';
// import PropTypes from 'prop-types';
// import history from '@/utils/history';
import mixin, { padStr } from '@/utils/mixin';
// import { Link } from "react-router-dom";
import { WhiteSpace, Flex, Toast } from 'antd-mobile';
// import { getLoudongs, getRooms, API } from './js/index';
import API from './js/index';
import WMLUtil from '@/utils/util';

import './sass/index.scss';

const wmlUtil = new WMLUtil();

@mixin({ padStr })
class Home extends Component {
  static contextTypes = {
    // router: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      tab_communitys: [], //社区集合
      show_tab: '', // tab_communitys, lou_dongs
      tab_communitys_active: '', // 选中的社区
      lou_dong_cache: {},  // 楼栋缓存
      lou_dongs: [], // 当前社区下的楼栋
      lou_dongs_active: '', // 选中的楼栋
      louceng_rooms: {}, // {楼层：房间列表}
      room_status:{
        "193604ec-ff4d-488c-b1bd-9b247645b028":"wating", // 待租
        "4819f760-7dbc-42ab-af61-e5a25e8878de":"rent", // 成租
        "6b5b48fa-eec4-4418-b999-660a0a89e33a":"book", // 预定
        "753f0e62-0059-4ce8-9b26-88d9c0ff45fe":"in_configuration", // 配置中
        "ac465406-10ca-4075-98b6-7c96bfbe13b7":"pending_configuration", // 待配置
        "2d706952-a87c-4d49-85fd-6caea815dbb4":"invalid", // 无效
        "018aeafb-fb9b-41d6-a19b-8f0f5c184fcd":"renege", // 违约
        "46f466fd-9127-46b1-8b62-7077b44aeaf7":"returned"  // 已退
      }
    };
  }

  // componentWillReceiveProps(nextProps) {
    // if(!is(fromJS(this.props.proData), fromJS(nextProps.proData))){
    //   this.initData(nextProps);
    // }
  // }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
  // }

  // componentWillMount() {
  // }
  componentDidMount() {
    // history.push("/code");
    API.getCommunitys({}).then(res=>{
      if(res.status.code==200){
        this.setState({ tab_communitys: res.result.list }, ()=>{
          res.result.list&&res.result.list.length>0&&this.chooseCommunitys(0);
        })
      }else{
        Toast.info(res.status.msg||"获取社区数据失败", 2);
      }
    }).catch(err=>{
      console.log(err);
    })
  }
  handClickChangeTab(d){
    const { show_tab } = this.state;
    if(show_tab===d){
      this.setBodyOverflow(false);
      this.setState({show_tab:""});
    }else{
      this.setBodyOverflow();
      this.setState({show_tab: d});
    }
  }
  /**
   * 选择框弹起，禁用body滚动
   */
  setBodyOverflow(set=true){
    var style = document.getElementsByTagName('body')[0].style;
    if(set){
      style.overflow = 'hidden';
      style.height = document.documentElement.clientHeight+'px';
    }else{
      style.overflow = '';
      style.height = '';
    }
  }

  /**
   * 选择社区
   */
  chooseCommunitys(i){
    const { tab_communitys, lou_dong_cache } = this.state;
    const lou_dongs = lou_dong_cache[tab_communitys[i].id];
    this.setBodyOverflow(false);
    this.setState({ tab_communitys_active:i, show_tab: "" });
    if(lou_dongs&&lou_dongs.length>0){
      this.setState({lou_dongs}, ()=>{
        this.chooseLoudong(0);
      });

    }else{
      API.getLoudongs({"params":{"houseItemId": tab_communitys[i].id}}).then(res=>{
        console.log(res);
        if(res.status.code==200){
          lou_dong_cache[tab_communitys[i].id] = res.result.list;
          this.setState({lou_dongs: res.result.list, lou_dong_cache}, ()=>{
            res.result.list&&res.result.list.length>0&&this.chooseLoudong(0);
          });
        }else{
          Toast.info(res.status.msg||"获取楼栋数据失败", 2);
        }
      }).catch(err=>{
        console.log(err);
      })
    }

  }
  chooseLoudong(i){
    const { tab_communitys, tab_communitys_active, lou_dongs } = this.state;
    this.setBodyOverflow(false);
    this.setState({lou_dongs_active: i, show_tab: ""});
    Toast.loading('数据加载中...');
    // 请求房源
    API.getRooms({houseItemId: tab_communitys[tab_communitys_active].id, louNo: lou_dongs[i].name}).then(res=>{

      console.log(res);
      if(res.status.code==200){
        this.setState({louceng_rooms: this.formatLoucengRoom(res.result.list)}, ()=>{
          Toast.hide();
        });
      }else{
        Toast.info(res.status.msg||"获取房源数据失败", 2);
      }
    }).catch(err=>{
      console.log(err);
      Toast.hide()
    });
  }
  formatLoucengRoom(list=[]){
    const backVal = {};
    for(var i=0; i<list.length; i++){
      if(backVal[list[i].loucengA]){
        backVal[list[i].loucengA].push(list[i]);
      }else{
        backVal[list[i].loucengA] = [list[i]];
      }
    }

    return backVal;
  }
  renderSelectContent(){
    const { show_tab, tab_communitys, tab_communitys_active, lou_dongs, lou_dongs_active } = this.state;
    let returnVal = '';
    switch (show_tab){
      case "tab_communitys":
        returnVal = tab_communitys.map((d, i)=>{
          return <li key={i} className={tab_communitys_active===i ? 'active' : ''} onClick={this.chooseCommunitys.bind(this,i)}>{d.hiItemName}</li>
        });
        break;
      case "tab_lou_dongs":
        returnVal = lou_dongs.map((d, i)=>{
          return <li key={i} className={lou_dongs_active===i ? 'active' : ''} onClick={this.chooseLoudong.bind(this,i)}>{d.name}楼</li>
        });
        break;
    }
    return returnVal;
  }
  renderRomm(key){
    const { louceng_rooms, room_status } = this.state;
    return louceng_rooms[key] ? louceng_rooms[key].map((room, i)=>{
      return <div className={`room ${room_status[room.zhuangtai.mark]}`} key={i}>
        <div className="r1">
          <span>{room.fangNo}</span>
          <i className="s_ico hide"></i>
        </div>
        <div className="r2">
          <span>¥{room.zujin}</span>
        </div>
      </div>
    })
    :
    '';
  }
  render() {
    const {tab_communitys, show_tab, tab_communitys_active, lou_dongs, lou_dongs_active, louceng_rooms } = this.state;
    return (
      <div className="fangtai-view">
        <ul className="tabs">
          <li className="tab" onClick={this.handClickChangeTab.bind(this, 'tab_communitys')}>
            <span className="show">{tab_communitys_active!==''?tab_communitys[tab_communitys_active].hiItemName:'全部社区'}</span>
          </li>
          <li className="tab w15" onClick={this.handClickChangeTab.bind(this, 'tab_lou_dongs')}>
            <span className="show">{(lou_dongs_active!=='' && lou_dongs[lou_dongs_active]) ? (lou_dongs[lou_dongs_active].name+'楼'):'不限'}</span>
          </li>
        </ul>
        <div className={show_tab===''?'hide':''}>
          <div className="modal-mask"></div>
          <ul className="selects ">
            {
              this.renderSelectContent()
            }
          </ul>
        </div>
        <WhiteSpace size="lg"></WhiteSpace>
        <div className="cont">
          <div className="title">
            <i className="ico"></i>
            <span className="name">{tab_communitys_active!==''?tab_communitys[tab_communitys_active].hiItemName:'全部社区'}</span>
          </div>
          <div className="list">
            {
              Object.keys(louceng_rooms).map(key=>{
                return <div className="row" key={key}>
                  <div className="flow">{key}层</div>
                  <Flex wrap="wrap" className="rooms">
                    {this.renderRomm(key)}
                  </Flex>
                </div>
              })
            }
          </div>
        </div>
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
