import { baseURL } from '@/envconfig/envconfig.js';
import { post } from '@/utils/request';
import { storage } from '@/utils/storage';

/**
 * 获取社区列表
 * @param params {  }
 * @returns {Promise<*>}
 */
export function getCommunitys(params={}) {
  return (async () => {
    const user = storage.getSession("user");
    params = Object.assign(params, user);
    const response = await post(`${baseURL}/v2/item/house_item/get_list`, params);
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

//
export function getLoudongs(params={}) {
  return (async () => {
    const user = storage.getSession("user");
    params = Object.assign(params, user);
    const response = await post(`${baseURL}/v2/item/house_lou_dong/get_list`, params);
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

export function getRooms(params){
  return (async () => {
    const user = storage.getSession("user");
    params = Object.assign(params, user);
    const response = await post(`${baseURL}/v2/house/focus_house/get_list`, params);
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
