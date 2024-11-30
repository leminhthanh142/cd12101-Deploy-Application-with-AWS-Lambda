import { corsHeaders } from '../../constants/headers.mjs'
import { generateUploadUrl } from '../../fileStorage/attachmentUtils.mjs'
import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from '../utils.mjs'

const logger = createLogger('generateUploadUrl')

export async function handler(event) {
  logger.info('Generating upload url', { todoId: event.pathParameters.todoId })
  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId

  try {
    const uploadUrl = await generateUploadUrl({ userId, todoId })
    logger.info('Generate upload url success', { todoId })
    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify({ uploadUrl })
    }
  } catch (e) {
    logger.error(`Error generating upload url: ${e.message}`)
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: e })
    }
  }
}
