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
import { baseURL } from '@/envconfig/envconfig.js';

FastClick.attach(document.body);

// 监听state变化
// store.subscribe(() => {
//   console.log('store发生了变化');
// });


function getUser(search='') {
  return (async () => {
    const response = await apiGet(`${baseURL}/v2/jjr_user_oa_login/oa_login_simple${search}`, );
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
    // setTimeout(()=>{
    //   storage.setSession('user', {
    //     token:"cce6dd9e-d3c0-44a4-bb6c-5fc329532b20",
    //     userid:"FEB43DF5KD2DFW411DQAD5612362B9EE3421",
    //     gcid: "021137",
    //   });
    //   renderDom();
    // }, 5000);
    // const params = getUrlParams(window.location.href);
    console.log('window.location.search=========', window.location.search);
    getUser(window.location.search).then(res => {
      console.log('user=========', res);
      storage.setSession('user', {
        token:"cce6dd9e-d3c0-44a4-bb6c-5fc329532b20",
        userid:"FEB43DF5KD2DFW411DQAD5612362B9EE3421",
        gcid: "021137",
      });
      renderDom();
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
