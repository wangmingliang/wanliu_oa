/**
 * 全局配置文件
 */
let baseURL = '';
let imgUrl = '';
if(process.env.NODE_ENV === 'development'){
  baseURL = '//test.pms.harbourhome.com.cn';
}else{
  baseURL = 'http://pmsoa.harbourhome.com.cn';
}

export default {imgUrl, baseURL}
