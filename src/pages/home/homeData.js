import { baseURL } from '@/envconfig/envconfig';
import { get } from '@/utils/request';

//获取首页信息
export function getInfo(params) {
  return (async () => {
    // console.log(baseURL);
    const response = await get(`baseURL`);
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
