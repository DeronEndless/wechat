const sha1 = require('sha1')
const getRawBody = require('raw-body')
const Wechat = require('./wechat')
const util = require('./util')

module.exports = function (opts) {
  let wechat = new Wechat(opts)
  return async ctx => {
    try {
      console.log('ctx.query', ctx.query)
      let token = opts.token
      let signature = ctx.query.signature
      let nonce = ctx.query.nonce
      let timestamp = ctx.query.timestamp
      let echostr = ctx.query.echostr

      let str = [token, timestamp, nonce].sort().join('')
      let sha = sha1(str)
      if (ctx.method === 'GET') {
        if (sha === signature) {
          ctx.body = echostr + ''
        } else {
          ctx.body = 'error'
        }
      } else if (ctx.method === 'POST'){
        if (sha !== signature) {
          ctx.body = 'error'
          return false
        }

        let data = await getRawBody(ctx.req, {
          length: ctx.length,
          limit: '1mb',
          encoding: ctx.charset
        })
        // xml转为json
        let content = await util.parseXMLAsync(data)
        console.log('content', content)
        // json转key vlaue
        let message = util.formetMessage(content.xml)

        console.log('message', message)

        if (message.MsgType === 'event') {
          if (message.Event === 'subscribe') {
            let now = new Date().getTime()

            ctx.status = 200
            ctx.type = 'application/xml'
            ctx.body = `
              <xml>
                <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
                <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
                <CreateTime>${now}</CreateTime>
                <MsgType><![CDATA[text]]></MsgType>
                <Content><![CDATA[Hi Deron I Love You]]></Content>
              </xml>
            `
            return 
          }
        }
      }

    } catch (err) {
      ctx.body = { message: err.message }
      ctx.status = err.status || 500
    }
  }
}