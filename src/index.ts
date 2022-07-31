import Koa from 'koa'
import router from './routes'
import body from 'koa-body'
import prisma from './lib'
import jwt from 'koa-jwt'
import {PORT, SECRET} from './constants'
import {verify} from 'jsonwebtoken'

const app = new Koa()

// Custom Context
app.context.prisma = prisma

// Middlewares
app.use(body())
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err: any) {
    if (err.statusCode === 401) {
      ctx.status = 401
      ctx.body = {
        status: 401,
        message: 'Unauthorized'
      }
    }
  }
})
app.use(jwt({secret: SECRET!}).unless({path: [/^\/auth/]}))
app.use(router.routes())

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
