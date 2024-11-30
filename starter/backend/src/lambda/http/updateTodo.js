import { updateTodo } from '../../businessLogic/todos.mjs'
import { corsHeaders } from '../../constants/headers.mjs'
import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from '../utils.mjs'

const logger = createLogger('updateTodo')

export async function handler(event) {
  logger.info('Updating todo item', { todoId: event.pathParameters.todoId })
  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId
  const updatedTodo = JSON.parse(event.body)

  try {
    await updateTodo({ userId, todoId, updatedTodo })
    logger.info('Update todo success', { todoId })
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: undefined
    }
  } catch (e) {
    logger.error(`Error updating todo: ${e.message}`)
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: e })
    }
  }
}
