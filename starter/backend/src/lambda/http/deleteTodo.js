import { deleteTodo } from '../../businessLogic/todos.mjs'
import { corsHeaders } from '../../constants/headers.mjs'
import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from '../utils.mjs'

const logger = createLogger('deleteTodo')

export async function handler(event) {
  logger.info('Deleting todo item', { todoId: event.pathParameters.todoId })
  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId

  try {
    await deleteTodo({ userId, todoId })
    logger.info('Delete todo success', { todoId })
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: undefined
    }
  } catch (e) {
    logger.error(`Error deleting todo: ${e.message}`)
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: e })
    }
  }
}
