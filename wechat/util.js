const xml2js = require('xml2js')
const Promise = require('bluebird')
const tpl = require('./tpl')
exports.parseXMLAsync = function (xml) {
  return new Promise ((resolve, reject) => {
    xml2js.parseString(xml, {trim: true}, function (err, content) {
      if (err) {
        reject(err)
      } else {
        resolve(content)
      }
    })
  })
}

function formetMessage (result) {
  let message = {}
  
  if (typeof result === 'object') {
    let keys = Object.keys(result)

    for (let i = 0; i < keys.length; i++) {
      let item = result[keys[i]]
      let key = keys[i]

      if (!(item instanceof Array) || item.length === 0) {
        continue
      }

      if (item.length === 1) {
        let val = item[0]

        if (typeof val === 'object') {
          message[key] = formetMessage(val)
        } else {
          message[key] = (val || '').trim()
        }
      } else {
        message[key] = []

        for (let j = 0, len = item.length; j < len; j++) {
          message[key].push(formetMessage(item[j]))
        }
      }
    }
  }
  console.log('message22222222', message)
  return message
}

exports.formetMessage = formetMessage

exports.tpl =  function (content, message) {
  let info = {}
  let type = 'text'
  let fromUserName = message.FromUserName
  let toUserName = message.ToUserName

  if (Array.isArray(content)) {
    type = 'news'
  }

  type = content.type || type 
  info.content = content
  info.createTime = new Date().getTime()
  info.msgType = type
  info.toUserName = fromUserName
  info.fromUserName = toUserName

  return tpl.compiled(info)
}