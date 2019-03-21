const sha1 = require('sha1')
const Promise = require('bluebird')
const request = Promise.promisify(require('request'))
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
      Promise.resolve(data)
    } else {
      return that.updataAccessToken()
    }
  }).then(data => {
    that.access_token = data.access_token
    that.expires_in = data.expires_in
    
    that.saveAccessToken(data)
  })
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

module.exports = function (opts) {
  let wechat = new Wechat(opts)
  return async (ctx) => {
    try {
        console.log(ctx.query)
        let token = opts.token
        let signature = ctx.query.signature
        let nonce = ctx.query.nonce
        let timestamp = ctx.query.timestamp
        let echostr = ctx.query.echostr
        let str = [token, timestamp, nonce].sort().join('')
        let sha = sha1(str)
        if (sha === signature) {
            ctx.body = echostr + ''
        } else {
            ctx.body = 'error'
        }
    } catch (err) {
        ctx.body = { message: err.message }
        ctx.status = err.status || 500
    }
  }
}