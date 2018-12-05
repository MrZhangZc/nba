import Koa from 'koa'
import KoaViews from 'koa-views'
import KoaStatic from 'koa-static'
import koabody from 'koa-body'
import { join } from 'path'
import log4js from 'log4js'
import path from 'path'
const router = require('koa-router')()

log4js.configure(path.resolve(__dirname, '../logConfig/config.json'))

import nbaSpider from './nba'

const PORT = process.env.PORT || '5003'
const HOST = process.env.HOST || '127.0.0.1'
const r = path => join(__dirname, path)

const app = new Koa()

app.use(koabody({
    multipart: true,
    formidable: {
        maxFileSize: 200 * 1024 * 1024 // 设置上传文件大小最大限制，默认2M
    }
}))


app.use(KoaStatic(r('../static')))
app.use(KoaViews(r('./'), {
    extension: 'pug'
}))

router.get('/', async ctx => {
    try{
        let log = log4js.getLogger("index");
        log.info('有人进来了')
        await ctx.render('index.pug')
    }catch(err){
        let log = log4js.getLogger("index");
        log.error('出现了错误')
    }
})

router.post('/nba', async ctx => {
    try {
        let log = log4js.getLogger("nba");
        const opts = ctx.request.body
        if (opts.email == '' || opts.nbaname == '') {
            throw new Error('输入有错误')
        }else{
            await nbaSpider(opts.email, opts.nbaname)
            ctx.body = `</h1>已经发送至${opts.email}, 请注意查收<h1>`;
            log.info(`发送成功到${opts.email} ${opts.nbaname}`)
        }
    } catch (err) {
        let log = log4js.getLogger("nba");
        log.error('出现了错误')
        ctx.body = `<h1>出现了错误,请检查一下输入内容</h1>`
    }
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(PORT, HOST, () => {
    console.log(`server Success on : ${HOST} : ${PORT}`)
})