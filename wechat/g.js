const sha1 = require('sha1')
const getRawBody = require('raw-body')
const Wechat = require('./wechat')

module.exports = function (opts) {
  let wechat = new Wechat(opts)
  return async ctx => {
    try {
      console.log(ctx.query)
      let token = opts.token
      let signature = ctx.query.signature
      let nonce = ctx.query.nonce
      let timestamp = ctx.query.timestamp
      let echostr = ctx.query.echostr

      let str = [token, timestamp, nonce].sort().join('')
      let sha = sha1(str)

      if (ctx.methods === 'GET') {
        console.log('ctx.methods', ctx.methods)
        if (sha === signature) {
          ctx.body = echostr + ''
        } else {
          ctx.body = 'error'
        }
      } else if (ctx.methods === 'POST'){
        console.log(1111)
        if (sha !== signature) {
          ctx.body = 'error'
          return false
        }
        console.log('ctx.req', ctx.req)
        let data = await getRawBody(ctx.req, {
          length: ctx.length,
          limit: '1mb',
          encoding: ctx.charset
        })
        console.log('data', data.toString())
      }

    } catch (err) {
      ctx.body = { message: err.message }
      ctx.status = err.status || 500
    }
  }
}