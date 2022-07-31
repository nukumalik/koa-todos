import {PrismaClient} from '@prisma/client'
import {Context, Request} from 'koa'

export interface MyRequest<T = any> extends Request {
  body: T
}

export interface MyContext<Body = any> extends Context {
  prisma: PrismaClient
  request: MyRequest<Body>
}

export interface AuthPayload {
  email: string
  password: string
}

export interface RegisterPayload extends AuthPayload {
  confirmPassword: string
}
