"use strict"
let lus = require('https://github.com/lixiaoyi232/lixyUtils/blob/master/index.js')


let index = 0
let end = 127
let toDir = '12027'
let uu = '6467a66f2646ac45a1a0005871636f6a'


async function start() {
  let items = []
  for (let i = 0; i <= end; i++) {
    let name = ('00000' + i).slice(-5) + '.ts'
    items.push(lus.downloadFile({url: `https://v.wuxvideo1.com/hls/${uu}/${name}`}, `./${toDir}/${name}`))
  }
  while (items.length > 0) await Promise.all(items.splice(0, 100))
}


start()










