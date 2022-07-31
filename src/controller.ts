import type {User} from '@prisma/client'
import {compareSync, genSaltSync, hashSync} from 'bcrypt'
import {sign} from 'jsonwebtoken'
import {SECRET} from './constants'
import {AuthPayload, MyContext, RegisterPayload} from './interface'

export const login = async (ctx: MyContext<AuthPayload>) => {
  try {
    const {email, password} = ctx.request.body
    const user = await ctx.prisma.user.findFirst({where: {email}})
    if (!user) throw new Error('User not found')
    if (!compareSync(password, user.password)) throw new Error('Password invalid')

    const tokenPayload = {...user, password: undefined}
    const accessToken = sign(tokenPayload, SECRET!, {expiresIn: 3600})

    ctx.status = 200
    ctx.body = {
      status: 200,
      message: 'Success to login',
      data: {
        accessToken,
        user: tokenPayload
      }
    }
  } catch (error: any) {
    ctx.status = 400
    ctx.body = {
      status: 400,
      message: 'Failed to login',
      error: error?.message ?? error
    }
  }
}

export const register = async (ctx: MyContext<RegisterPayload>) => {
  try {
    const {email, password, confirmPassword} = ctx.request.body
    if (password !== confirmPassword) throw new Error('Password is not match')

    const user = await ctx.prisma.user.findFirst({where: {email}})
    if (user) throw new Error('Email was registered')

    await ctx.prisma.user.create({data: {email, password: hashSync(password, genSaltSync(10))}})

    ctx.status = 201
    ctx.body = {
      status: 201,
      message: 'Success to register'
    }
  } catch (error: any) {
    ctx.status = 400
    ctx.body = {
      status: 400,
      message: 'Failed to register',
      error: error?.message ?? error
    }
  }
}

export const getTodos = async (ctx: MyContext) => {
  try {
    const data = await ctx.prisma.todo.findMany()
    ctx.status = 200
    ctx.body = {
      status: 200,
      message: 'Success to get todos',
      data
    }
  } catch (error: any) {
    ctx.status = 400
    ctx.body = {
      status: 400,
      message: 'Failed to get todos',
      error: error?.message ?? error
    }
  }
}

export const getTodo = async (ctx: MyContext) => {
  try {
    const {id} = ctx.params
    const data = await ctx.prisma.todo.findFirst({
      where: {id},
      include: {
        user: {
          select: {id: true, email: true, createdAt: true, updatedAt: true}
        }
      }
    })

    ctx.body = {
      status: 200,
      message: 'Success to get todo',
      data
    }
  } catch (error: any) {
    ctx.status = 400
    ctx.body = {
      status: 400,
      message: 'Failed to get todo',
      error: error?.message ?? error
    }
  }
}

export const createTodo = async (ctx: MyContext) => {
  try {
    const {id} = ctx.state.user as User
    const {title} = ctx.request.body
    const data = await ctx.prisma.todo.create({data: {title, userId: id}})

    ctx.body = {
      status: 201,
      message: 'Success to create todo',
      data
    }
  } catch (error: any) {
    ctx.status = 401
    ctx.body = {
      status: 401,
      message: 'Failed to create todo',
      error: error?.message ?? error
    }
  }
}

export const updateTodo = async (ctx: MyContext) => {
  try {
    const {id} = ctx.params
    const todo = await ctx.prisma.todo.findFirst(id)
    if (!todo) throw new Error('Todo is not found')

    const {title, isComplete} = ctx.request.body
    const payload: any = {}
    if (title) payload.title = title
    if (isComplete) payload.isComplete = isComplete

    const updated = await ctx.prisma.todo.update({where: {id}, data: payload})

    ctx.body = {
      status: 200,
      message: 'Success to update todo',
      data: updated
    }
  } catch (error: any) {
    ctx.status = 400
    ctx.body = {
      status: 400,
      message: 'Failed to update todo',
      error: error?.message ?? error
    }
  }
}

export const deleteTodo = async (ctx: MyContext) => {
  try {
    const {id} = ctx.params
    await ctx.prisma.todo.delete({where: {id}})

    ctx.body = {
      status: 200,
      message: 'Success to delete todo'
    }
  } catch (error: any) {
    ctx.status = 400
    ctx.body = {
      status: 400,
      message: 'Failed to delete todo',
      error: error?.message ?? error
    }
  }
}
