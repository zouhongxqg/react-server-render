const axios = require('axios');
const wxApi = axios.create({
  baseURL: 'https://api.weixin.qq.com',
  timeout: 10000,
  withCredentials: true,
  responseType: 'json',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
  validateStatus() {
    return true;
  },
});
export default wxApi;
