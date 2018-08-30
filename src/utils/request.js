import 'whatwg-fetch';
import { merge, isArray } from 'lodash';
import { browserHistory } from 'react-router';

let __fetch = fetch;
export const defaultParams = {
  mode: 'cors',
  credentials: 'include',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8'
  }
};
// fetch = function(url, param) {
//   let __param = merge(
//     param,
//     {
//       headers: {
//         'x-token': window.localStorage.getItem('token')
//       }
//     },
//     function(a, b) {
//       if (isArray(a)) {
//         return a.concat(b);
//       }
//     }
//   );
//   return __fetch(url, __param)
//     .then(rsp => {
//       if (rsp.status === 401) {
//         message.info('认证失效，请重新登录');
//         localStorage.removeItem('userInfo');
//         browserHistory.push('/login');
//       }
//       const freshToken = rsp.headers.get('x-fresh-token');
//       if (freshToken) {
//         window.localStorage.setItem('token', freshToken);
//       }
//       return rsp;
//     })
//     .catch(function(e) {
//       console.error(e);
//       return e;
//     });
// };

export function get(url, params = {}) {
  return fetch(url, {
    // ...defaultParams,
    ...params,
    method: 'get'
  });
}

/**
 * HTTP GET
 * @param  {string} url
 * @return {Promise}
 */
export function read(url) {
  return fetch(url, {
    // ...defaultParams,
    method: 'get'
  });
}

/**
 * HTTP POST
 * @param  {string} url
 * @param  {object} body
 * @return {Promise}
 */
export function create(url, body = {}) {
  return fetch(url, {
    // ...defaultParams,
    method: 'post',
    body: JSON.stringify(body)
  });
}
/**
 * HTTP POST
 * @param  {string} url
 * @param  {object} body
 * @return {Promise}
 */
export function post(url, body = {}) {
  return fetch(url, {
    // ...defaultParams,
    method: 'post',
    body: JSON.stringify(body),
    headers: {
      'Content-Type':'application/json'
    }
  });
}

/**
 * HTTP PUT
 * @param  {string} url
 * @param  {object} body
 * @return {Promise}
 */
export function update(url, body = {}) {
  return fetch(url, {
    // ...defaultParams,
    method: 'put',
    body: JSON.stringify(body)
  });
}

/**
 * HTTP DELETE
 * @param  {string} url
 * @return {Promise}
 */
export function destroy(url, body = {}) {
  console.log(body);
  return fetch(url, {
    // ...defaultParams,
    method: 'delete',
    body: JSON.stringify(body)
  });
}

/**
 * HTTP PATCH
 * @param  {string} url
 * @param  {object} body
 * @return {Promise}
 */
export function patch(url, body = {}) {
  return fetch(url, {
    // ...defaultParams,
    method: 'PATCH',
    body: JSON.stringify(body)
  });
}
