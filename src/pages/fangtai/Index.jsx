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
import './sass/index.scss';
import Empty from '@/components/empty/Empty.jsx';
import axios from 'axios';

const CancelToken = axios.CancelToken;

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
        // "193604ec-ff4d-488c-b1bd-9b247645b028":"wating", // 待租
        // "4819f760-7dbc-42ab-af61-e5a25e8878de":"rent", // 已租
        // "6b5b48fa-eec4-4418-b999-660a0a89e33a":"book", // 预定
        // "753f0e62-0059-4ce8-9b26-88d9c0ff45fe":"in_configuration", // 配置中
        // "ac465406-10ca-4075-98b6-7c96bfbe13b7":"pending_configuration", // 待配置
        // "2d706952-a87c-4d49-85fd-6caea815dbb4":"invalid", // 无效
        // "018aeafb-fb9b-41d6-a19b-8f0f5c184fcd":"renege", // 违约
        // "46f466fd-9127-46b1-8b62-7077b44aeaf7":"returned"  // 已退
        "20":"wating", // 待租
        "40":"rent", // 已租
        "30":"book", // 预定
        "11":"in_configuration", // 配置中
        // "ac465406-10ca-4075-98b6-7c96bfbe13b7":"pending_configuration", // 待配置
        "60":"invalid", // 无效
        // "018aeafb-fb9b-41d6-a19b-8f0f5c184fcd":"renege", // 违约
        // "46f466fd-9127-46b1-8b62-7077b44aeaf7":"returned"  // 已退
      },
      house_status:{
        wating: {
          code: '21',
          txt: '可租'
        },
        rent: {
          code: '40',
          txt: '已租'
        },
        book: {
          code: '30',
          txt: '预定'
        },
        in_configuration: {
          code: '11',
          txt: '配置'
        },
        invalid: {
          code: '60',
          txt: '无效'
        }
      },
      house_status_active: '', // 选中的房源状态，key值
      loudong_source: '',  //
      room_source: '',
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
    let { tab_communitys, lou_dong_cache, loudong_source } = this.state;
    const lou_dongs = lou_dong_cache[tab_communitys[i].id];
    this.setBodyOverflow(false);
    this.setState({ tab_communitys_active:i, show_tab: "" });
    if(lou_dongs&&lou_dongs.length>0){
      this.setState({lou_dongs}, ()=>{
        this.chooseLoudong(0);
      });

    }else{
      if(!loudong_source){
        loudong_source = CancelToken.source();
        this.setState({loudong_source});
      }
      API.getLoudongs({"params":{"houseItemId": tab_communitys[i].id}}, loudong_source).then(res=>{
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
    this.setBodyOverflow(false);
    this.setState({lou_dongs_active: i, show_tab: ""}, ()=>{
      this.getData();
    });
  }
  getData(){
    let { tab_communitys, tab_communitys_active, lou_dongs, lou_dongs_active, house_status_active, house_status, room_source } = this.state;
    Toast.loading('数据加载中...', 0);
    if(!room_source){
      room_source = CancelToken.source();
      this.setState({room_source});
    }
    // 请求房源
    API.getRooms({houseItemId: tab_communitys[tab_communitys_active].id, louNo: lou_dongs[lou_dongs_active].name, houseStatus: house_status_active?house_status[house_status_active].code:""}, room_source).then(res=>{
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
      var _temp = {
        fangNo: list[i].fangNo,
        zhuangtai:{mark:list[i].zhuangtai.mark},
        zujin: list[i].zujin,
        status: list[i].status
      };
      if(backVal[list[i].loucengA]){
        backVal[list[i].loucengA].push(_temp);
      }else{
        backVal[list[i].loucengA] = [_temp];
      }
    }

    return backVal;
  }
  chooseHouseStatus(k){
    this.setBodyOverflow(false);
    this.setState({house_status_active: k, show_tab: ""}, ()=>{
      this.getData();
    })
  }
  renderSelectContent(){
    const { show_tab, tab_communitys, tab_communitys_active, lou_dongs, lou_dongs_active, house_status } = this.state;
    let returnVal = '';
    switch (show_tab){
      case "tab_communitys":
        returnVal = (<ul className="selects ">
          {
            tab_communitys.map((d, i)=>{
              return <li key={'communitys_'+i} className={tab_communitys_active===i ? 'active' : ''} onClick={this.chooseCommunitys.bind(this,i)}>{d.hiItemName}</li>
            })
          }
        </ul>);
        break;
      case "tab_lou_dongs":
        returnVal = (<ul className="selects ">
          {
            lou_dongs.map((d, i)=>{
              return <li key={'lou_dongs_'+i} className={lou_dongs_active===i ? 'active' : ''} onClick={this.chooseLoudong.bind(this,i)}>{d.name}楼</li>
            })
          }
        </ul>);
        break;
      case "tab_house_status":
        returnVal = (<div className="selects tab_house_status">
          <Flex wrap="wrap" className="empty" onClick={this.chooseHouseStatus.bind(this,"")}>不限</Flex>
          {
            Object.keys(house_status).map((k, i)=>{
              return <Flex wrap="wrap" key={"house_status_"+i} className={k} onClick={this.chooseHouseStatus.bind(this,k)}>{house_status[k].txt}</Flex>
              // <li key={i} className={k} onClick={this.chooseHouseStatus.bind(this,k)}>{house_status[k].txt}</li>
            })
          }
          </div>);
        break;
    }
    return returnVal;
  }
  renderRomm(key){
    const { louceng_rooms, room_status } = this.state;
    return louceng_rooms[key] ? louceng_rooms[key].map((room, i)=>{
      return <div className={`room ${room_status[room.status]}`} key={"rooms_"+i}>
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
    const {tab_communitys, show_tab, tab_communitys_active, lou_dongs, lou_dongs_active, louceng_rooms,house_status_active, house_status } = this.state;
    return (
      <div className="fangtai-view">
        <ul className="tabs">
          <li className="tab" onClick={this.handClickChangeTab.bind(this, 'tab_communitys')}>
            <span className="show">{tab_communitys_active!==''?tab_communitys[tab_communitys_active].hiItemName:'全部社区'}</span>
          </li>
          <li className="tab w15" onClick={this.handClickChangeTab.bind(this, 'tab_lou_dongs')}>
            <span className="show">{(lou_dongs_active!=='' && lou_dongs[lou_dongs_active]) ? (lou_dongs[lou_dongs_active].name+'楼'):'不限'}</span>
          </li>
          <li className="tab w15" onClick={this.handClickChangeTab.bind(this, 'tab_house_status')}>
            <span className="show">{house_status_active?house_status[house_status_active].txt : '不限'}</span>
          </li>
        </ul>
        <div className={show_tab===''?'hide':''}>
          <div className="modal-mask"></div>
          {
            this.renderSelectContent()
          }
        </div>
        <WhiteSpace size="lg"></WhiteSpace>
        <div className="cont">
          <div className="title">
            <i className="ico"></i>
            <span className="name">{tab_communitys_active!==''?tab_communitys[tab_communitys_active].hiItemName:'全部社区'}</span>
          </div>
          <div className="list">
            {
              (() => {
                let _arrs = Object.keys(louceng_rooms);
                if(_arrs.length===0){
                  return <Empty desc="暂无数据"></Empty>;
                }else{
                  return _arrs.map(key=>{
                    return <div className="row" key={key}>
                      <div className="flow">{key}层</div>
                      <Flex wrap="wrap" className="rooms">
                        {this.renderRomm(key)}
                      </Flex>
                    </div>
                  });
                }
              })()
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
