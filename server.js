const Koa = require('koa')
const Router = require('koa-router')
const logger = require('koa-logger')
const app = new Koa()
const router = new Router()
app.use(logger())

router.get('/', (ctx, next) => {
    ctx.body = 'Hello world 2'
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000, () => {
    console.info(`server listening on port 3000`)
})