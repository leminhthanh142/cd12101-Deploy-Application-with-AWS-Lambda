import { createTodo } from '../../businessLogic/todos.mjs'
import { corsHeaders } from '../../constants/headers.mjs'
import { getUserId } from '../utils.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('createTodo')

export async function handler(event) {
  logger.info('Creating todo item')
  const userId = getUserId(event)
  const body = JSON.parse(event.body)

  try {
    const newTodo = await createTodo({ userId, body })
    logger.info('Create todo success', { newTodo })
    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify({ item: newTodo })
    }
  } catch (e) {
    logger.error(`Error creating todo: ${e.message}`)
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: e })
    }
  }
}
