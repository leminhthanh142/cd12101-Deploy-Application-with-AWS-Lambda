
import createLogger from '../utils/logger.mjs'

const logger = createLogger('createTodo')

export function handler(event) {
  logger.info('Creating todo item: ', { event })
  const newTodo = JSON.parse(event.body)

  // TODO: Implement creating a new TODO item
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newTodo
    })
  }
}

