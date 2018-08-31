import { storage } from '@/utils/storage';
import Server from '@/api/server';

class API extends Server {
  /**
   * 获取社区列表
   * @param params {  }
   * @returns {Promise<*>}
   */
  async getCommunitys(params = {}){
    try{
      const user = storage.getSession("user");
      params = Object.assign(params, user);
      let result = await this.axios({url: `/v2/item/house_item/get_list`, data:params, method: 'post'});
      return new Promise((resolve, reject) => {
        resolve(result);
      });
    }catch(err){
      throw err;
    }
  }

  /**
   * 获取楼栋
   * @param params, source:axios的source资源
   * @returns {Promise<any>}
   */
  async getLoudongs(params = {}, source){
    try{
      const user = storage.getSession("user");
      params = Object.assign(params, user);
      if(source){
        source.cancel();
        params['cancelToken'] = source.token;
      }
      let result = await this.axios({url: `/v2/item/house_lou_dong/get_list`, data:params, method: 'post'});
      return new Promise((resolve, reject) => {
        resolve(result);
      });
    }catch(err){
      throw err;
    }
  }

  /**
   * 获取房源
   * @param params
   * @returns {Promise<any>}
   */
  async getRooms(params = {}, source){
    try{
      const user = storage.getSession("user");
      params = Object.assign(params, user);
      if(source){
        source.cancel();
        params['cancelToken'] = source.token;
      }
      let result = await this.axios({url: `/v2/house/focus_house/get_list`, data:params, method: 'post'});
      return new Promise((resolve, reject) => {
        resolve(result);
      });
    }catch(err){
      throw err;
    }
  }

}
export default new API();
