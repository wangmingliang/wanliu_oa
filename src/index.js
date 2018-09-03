import React from 'react';
import ReactDOM from 'react-dom';
import Route from './router/';
import FastClick from 'fastclick';
import registerServiceWorker from './registerServiceWorker';
import { AppContainer } from 'react-hot-loader';
import {Provider} from 'react-redux';
import store from '@/store/store';
// import './utils/setRem';
import './style/base.scss';
import Loading from '@/components/loading/Loading';
import { storage } from "./utils/storage";
import { get as apiGet } from '@/utils/request';
import envconfig from '@/envconfig/envconfig.js';
import { Toast } from 'antd-mobile';


FastClick.attach(document.body);

// 监听state变化
// store.subscribe(() => {
//   console.log('store发生了变化');
// });


function getUser(search='') {
  return (async () => {
    const response = await apiGet(`${envconfig.baseURL}/v2/jjr_user_oa_login/oa_login_simple${search}`, );
    const _data = await response.json();
    return new Promise((resolve, reject) => {
      if (response.status < 300) {
        resolve(_data);
      } else {
        reject(_data);
      }
    });
  })();
}

const render = Component => {
  const initData = ()=>{
    renderLoading();
    let startTime = Date.now();
    // setTimeout(()=>{
    //   storage.setSession('user', {
    //     token:"043bc922-44a0-4d28-b364-b9bee2a92021",
    //     userid:"8f940247f22d468ab23f9e79f7c710d4",
    //     gcid: "021137",
    //   });
    //
    //   let timeout = Date.now()-startTime>2000 ? 1000 : (1000+Date.now()-startTime);
    //   setTimeout(()=>{
    //     renderDom();
    //   }, timeout);
    //   // renderDom();
    // }, 2000);
    getUser(window.location.search).then(res => {
      if(res.status.code==200){
        // 登录成功
        storage.setSession('user', {
          token: res.result.token,
          userid: res.result.id,
          gcid: "021137",
        });

        let timeout = Date.now()-startTime>2000 ? 1000 : (1000+Date.now()-startTime);
        setTimeout(()=>{
          renderDom();
        }, timeout);

      }else{
        Toast.info(res.status.msg||'登录失败',2)
      }
    }).catch(err=>{
      console.log(err);
    });
  }
  const renderDom = ()=>{
    ReactDOM.render(
      //绑定redux、热加载
      <Provider store={store}>
        <AppContainer>
          <Component />
        </AppContainer>
      </Provider>,
      document.getElementById('root'),
    )
  }
  const renderLoading = ()=>{
    ReactDOM.render(
      <Loading></Loading>,
      document.getElementById('root'),
    )
  }
  initData();
}

render(Route);

// Webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./router/', () => {
    render(Route);
  })
}

registerServiceWorker();