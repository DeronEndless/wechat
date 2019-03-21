const path = require('path')
const wechat_file = path.join(__dirname, '../config/wechat.txt')
const util = require('../libs/util')
const config = {
  appId: 'wx58a883ce4e5cbf51',
  appSecret: '469eea479b6f2bc3c360a52e64571c26',
  token: 'zhaofuguo',
  getAccessToken: function () {
    return util.readFileAsync(wechat_file)
  },
  saveAccessToken: function (data) {
    data = JSON.stringify(data)
    return util.writeFileAsync(wechat_file, data)
  }
}
module.exports =  {
  appId: config.appId,
  appSecret: config.appSecret,
  token: config.token,
  getAccessToken: config.getAccessToken,
  saveAccessToken: config.saveAccessToken,
}