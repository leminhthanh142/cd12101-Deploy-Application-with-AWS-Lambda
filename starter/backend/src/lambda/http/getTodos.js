import { getTodos } from '../../businessLogic/todos.mjs'
import { corsHeaders } from '../../constants/headers.mjs'
import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from '../utils.mjs'

const logger = createLogger('getTodos')
export async function handler(event) {
  logger.info('Getting todo items')
  const userId = getUserId(event)

  try {
    const todos = await getTodos({ userId })
    logger.info('Get todos success')
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ items: todos })
    }
  } catch (e) {
    logger.error(`Error getting todos: ${e.message}`)
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: e })
    }
  }
}
