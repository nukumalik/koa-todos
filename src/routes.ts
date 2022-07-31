import {createTodo, deleteTodo, getTodo, getTodos, login, register, updateTodo} from './controller'
import Router from 'koa-router'

const router: Router<any, any> = new Router()

router
  .get('/', ctx => {
    ctx.body = 'Hello, World!'
  })

  // Auth
  .post('/auth/login', login)
  .post('/auth/register', register)

  // Todos
  .get('/todos', getTodos)
  .get('/todos/:id', getTodo)
  .post('/todos', createTodo)
  .put('/todos/:id', updateTodo)
  .delete('/todos/:id', deleteTodo)

export default router
