let axios = require('axios')
let fs = require('fs-extra')
let path = require('path')
let request = require('request')
 
class Ut {
  static downImg(opts = {}, path = '') {
    return new Promise((resolve, reject) => {
      request.get(opts)
      .pipe(fs.createWriteStream(path))
      .on('error', (e) => {
        resolve('')
      })
      .on('finish', () => {
        resolve('ok')
      })
    })
  }
}

let index = 5660
let end = 5860
let toDir = '33'
let nuu = 'LXWzkN4125'
let uu = 'wz0SyS9g'

async function saveTs() {
  let name = nuu + index + '.ts'
  await Ut.downImg({url: `https://kbzy.zxziyuan-yun.com/20180211/${uu}/800kb/hls/${name}`}, `./${toDir}/${name}`)
}

async function start() {
  await fs.ensureDir(toDir)
  let items = []
  while (index <= end) {
    console.log(index)
    items.push(saveTs())
    index++
  }
  await Promise.all(items)
}


start()
