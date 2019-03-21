var Koa = require('koa')
var sha1 = require('sha1')

var config = {
    wechat: {
        appID: 'wx58a883ce4e5cbf51',
        appSecret: '469eea479b6f2bc3c360a52e64571c26',
        token: 'zhaofuguo'
    }
}

var app = new Koa()
app.use(async (ctx, next) => {
    try {
        console.log(ctx.query)
        let token = config.wechat.token
        let signature = ctx.query.signature
        let nonce = ctx.query.nonce
        let timestamp = ctx.query.timestamp
        let echostr = ctx.query.echostr
        let str = [token, timestamp, nonce].sort().join('')
        console.log('str', str)
        let sha = sha1(str)
        console.log('sha', sha)
        console.log('signature', signature)
        if (sha === signature) {
            ctx.body = echostr + ''
        } else {
            ctx.body = 'error'
        }
    } catch (err) {
        ctx.body = { message: err.message }
        ctx.status = err.status || 500
    }
})

app.listen(7788)
console.log('Listening 7788')