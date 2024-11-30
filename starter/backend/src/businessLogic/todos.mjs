import * as uuid from 'uuid'
import { TodoAccess } from '../dataLayer/todosAccess.mjs'

const todoAccess = new TodoAccess()

export async function getTodos({ userId }) {
  return todoAccess.getTodos({ userId })
}

export async function createTodo({ userId, newTodoData }) {
  const todoId = uuid.v4()
  const createdAt = new Date().toISOString()
  const done = false
  const newTodo = { todoId, userId, createdAt, done, ...newTodoData }
  return todoAccess.createTodo({ newTodo })
}

export async function updateTodo({ userId, todoId, updateData }) {
  return todoAccess.updateTodo({ userId, todoId, updateData })
}

export async function deleteTodo({ userId, todoId }) {
  return todoAccess.deleteTodo({ userId, todoId })
}
