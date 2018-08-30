import { baseURL } from '@/envconfig/envconfig.js';
import { post } from '@/utils/request';
import { storage } from '@/utils/localStorage';

//
export function getCommunitys(params={}) {
  return (async () => {
    // console.log(baseURL);
    params = Object.assign(params, {
      token:"cce6dd9e-d3c0-44a4-bb6c-5fc329532b20",
      userid:"FEB43DF5KD2DFW411DQAD5612362B9EE3421",
      gcid: "021137",
    });
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
    // console.log(baseURL);
    params = Object.assign(params, {
      token:"cce6dd9e-d3c0-44a4-bb6c-5fc329532b20",
      userid:"FEB43DF5KD2DFW411DQAD5612362B9EE3421",
      gcid: "021137",
    });
    const user = storage.get("user");
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
    // console.log(baseURL);
    params = Object.assign(params, {
      token:"cce6dd9e-d3c0-44a4-bb6c-5fc329532b20",
      userid:"FEB43DF5KD2DFW411DQAD5612362B9EE3421",
      gcid: "021137",
    });
    const user = storage.get("user");
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
