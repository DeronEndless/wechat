var Koa = require('Koa')
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
        let timeStamp = ctx.query.timeStamp
        let ecostr = ctx.query.ecostr
        let tmpStr = [token, timeStamp, nonce].sort().join('')
        let shaStr = sha1(tmpStr)
        if (shaStr === signature) {
            ctx.body = ecostr + ''
        } else {
            ctx.body = 'error'
        }

    } catch (err) {
        ctx.body = { message: err.message }
        ctx.status = err.status || 500
    }
})

app.listen(7777)
console.log('Listening 7777')