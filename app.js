const Koa = require('koa')
const g = require('./wechat/g')
const wechatConfig = require('./wechat/config')

const app = new Koa()
app.use(g(wechatConfig))

app.listen(7788)
console.log('Listening 7788')