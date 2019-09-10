"use strict"
const lus = require('https://github.com/lixiaoyi232/lixyUtils/blob/master/index.js')
const axios = require('axios')
const gbk = require('gbk')
const fs = require('fs-extra')
const path = require('path')
  
let min = '3854'
let max = '3889'

let url = 'http://n9.1whour.com/'
let titleObj = {}

let end = 0
let toDir = ''
let nums = []


async function downImg(u, i) {
  console.log(i)
  await lus.downloadFile({url: await getImg(u)}, `./llz/${toDir}/${('00000' + i).slice(-5) + '.jpg'}`)
}

async function getImg(u) {
  let res = await axios.get(u, {responseType: 'arraybuffer'})
  let html = gbk.toString('utf-8', Buffer.concat([res.data]))
  let img = url + html.slice(html.indexOf('+"') + 2, html.indexOf('.jpg') + 4)
  return encodeURI(img)
}

async function getSection(min) {
  let res = await axios.get(`http://comic.ikkdm.com/comiclist/286/`, {responseType: 'arraybuffer'})
  let html = gbk.toString('utf-8', Buffer.concat([res.data]))
  if (min !== '') html = html.slice(html.lastIndexOf(`/${min}/`) + min.length + 2)
  if (max !== '') html = html.slice(0, html.lastIndexOf(`/${max}/`) + max.length + 20)
  let nums = []
  html = html.slice(html.indexOf('/286/index') + 10)
  let index = html.indexOf('/286/')
  while (index > 0) {
    let end = html.indexOf('/1.htm')
    let str = html.slice(index + 5, end)
    if (nums.indexOf(str) === -1) nums.push(str)
    html = html.slice(end + 6)
    index = html.indexOf('/286/')
  }
  return nums
}

async function getPage() {
  let res = await axios.get(`http://comic.ikkdm.com/comiclist/286/${toDir}/1.htm`, {responseType: 'arraybuffer'})
  let html = gbk.toString('utf-8', Buffer.concat([res.data]))
  titleObj[toDir] = html.slice(html.indexOf('<title>') + 7, html.indexOf('</title>'))
  return parseInt(html.slice(html.indexOf(' | 共') + 4, html.indexOf('页')))
}

async function createHtml() {
  let dirs = await fs.readdir(path.join(__dirname, './llz'))
  dirs = dirs.filter(item => !isNaN(item)).map(item => parseInt(item))
  dirs = dirs.sort((x, y) => x - y)
  for (let i in dirs) {
    let imgs = await fs.readdir(path.join(__dirname, `./llz/${dirs[i]}`))
    imgs = imgs.filter(item => item.endsWith('.jpg'))
    await fs.createFileSync(`./llz/${dirs[i]}/index.html`)
    let str = `<!DOCTYPE html><html lang="zh-cn"><head><title>${titleObj[dirs[i]]}</title></head><body style="display: flex; align-items: center; flex-flow: column;">`
    if (i !== '0') str += `<button style="width: 80vw; height: 200px; font-size: 50px;" onclick="window.location.href='${path.join(__dirname, './llz/' + dirs[i - 1] + '/index.html')}'">上一话</button>`
    for (let j of imgs) str += `<img src="./${j}" style="width: 80vw; border: solid 1px black;">`  
    if (i !== dirs.length - 1 + '') str += `<button style="width: 80vw; height: 200px; font-size: 50px;" onclick="window.location.href='${path.join(__dirname, './llz/' + dirs[parseInt(i) + 1] + '/index.html')}'">下一话</button>`  
    str += '</body></html>' 
    await fs.outputFileSync(`./llz/${dirs[i]}/index.html`, str)
  }
}

async function init() {
  nums = await getSection(min) 
  console.log(nums)  
}

async function start() {
  await init()
  let items = []
  for (let j of nums) {
    toDir = j
    end = await getPage()
    for (let i = 1; i <= end; i++) items.push(downImg(`http://comic.ikkdm.com/comiclist/286/${toDir}/${i}.htm`, i))
    while (items.length > 0) {await Promise.all(items.splice(0, 10))}
  }
  console.log('download imgs end')  
  await createHtml()
}

start()








