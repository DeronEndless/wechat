const Promise = require('bluebird')
const request = Promise.promisify(require('request'))
const util = require('./util')
const prefix = 'https://api.weixin.qq.com/cgi-bin/token'
const api = {
  accessToken: `${prefix}?grant_type=client_credential`
}
function Wechat(opts) {
  const that = this
  this.appId = opts.appId
  this.appSecret = opts.appSecret
  this.getAccessToken = opts.getAccessToken
  this.saveAccessToken = opts.saveAccessToken
  
  this.getAccessToken().then(data => {
    try {
      data = JSON.parse(data)
    } catch (error) {
      return that.updataAccessToken()
    }
    if (that.isValidAccessToken(data)) {
      return Promise.resolve(data)
    } else {
      return that.updataAccessToken()
    }
  }).then(data => {
    that.access_token = data.access_token
    that.expires_in = data.expires_in
    console.log('accessToken Data', data)
    that.saveAccessToken(data)
  })
}
Wechat.prototype.isValidAccessToken = function (data) {
  if (!data || !data.access_token || !data.expires_in) {
    return false
  }
  let access_token = data.access_token
  let expires_in = data.expires_in
  let now = (new Date().getTime())

  if (now < expires_in) {
    return true
  } else {
    return false
  }
}

Wechat.prototype.updataAccessToken = function (data) {
  let appId = this.appId
  let appSecret = this.appSecret
  let url = `${api.accessToken}&appid=${appId}&secret=${appSecret}`

  return new Promise((resolve, reject) => {
    request({url: url, json: true}).then(res => {
      console.log('res.body', res.body)
      console.log('res.body.expires_in', res.body.expires_in)
      let data = res.body
      let now = (new Date().getTime())
      let expires_in = now + (data.expires_in - 20) * 1000
      
      data.expires_in = expires_in
      resolve(data)
    })
  })
}

Wechat.prototype.reply = function () {
  let content = this.body
  let message = this.wechat
  let xml = util.tpl(content, message)
  
  this.status = 200
  this.type = 'application/xml'
  this.body = xml
}
module.exports = Wechat