const Koa = require('koa')
const wechat = require('./wechat/g')
const wechatConfig = require('./wechat/config')
const weixin = require('./weixin')
const app = new Koa()
app.use(wechat(wechatConfig, weixin.reply))

app.listen(7788)
console.log('Listening 7788')