exports.reply = async function (next) {
  let message = this.wechat

  if (message.MsgType === 'event') {
    if (message.Event === 'subscribe') {
      if (message.EventKey) {
        console.log(`扫二维码进来 ${message.EventKey} ${message.ticket}`)
      }
      this.body = `哈哈哈哈哈你订阅了这个公众号 消息ID:${message.MsgId}`
    } else if (message.Event = 'unsubscribe') {
      console.log('无情取关')
      this.body = ''
    }
  } else {

  }
  
}