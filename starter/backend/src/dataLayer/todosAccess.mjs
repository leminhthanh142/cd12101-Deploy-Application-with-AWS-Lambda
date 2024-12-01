import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand,
  DeleteCommand
} from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('todoAccess')
const dynamoDbClient = AWSXRay.captureAWSv3Client(new DynamoDBClient({}))
const dynamoDbDocument = DynamoDBDocumentClient.from(dynamoDbClient)

export class TodoAccess {
  constructor() {
    this.dynamoDBDocument = dynamoDbDocument
    this.todosTable = process.env.TODOS_TABLE
  }

  async getTodos({ userId }) {
    logger.info(`Fetching all todos for user: ${userId}`)
    const command = new QueryCommand({
      TableName: this.todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': {
          "S": userId
        }
      }
    })

    const res = await this.dynamoDBDocument.send(command)
    return res.Items
  }

  async createTodo({ newTodo }) {
    logger.info('Creating new todo item', { newTodo })

    const command = new PutCommand({
      TableName: this.todosTable,
      Item: newTodo
    })

    await this.dynamoDBDocument.send(command)
    return newTodo
  }

  async updateTodo({ userId, todoId, updatedTodo }) {
    logger.info('Updating todo item', { userId, todoId, updatedTodo })

    const command = new UpdateCommand({
      TableName: this.todosTable,
      Key: { userId, todoId },
      ConditionExpression: 'attribute_exists(todoId)',
      UpdateExpression: 'set done = :done',
      ExpressionAttributeValues: {
        ':done': updatedTodo.done
      }
    })

    await this.dynamoDBDocument.send(command)
  }

  async deleteTodo({ userId, todoId }) {
    logger.info('Deleting todo item', { userId, todoId })

    const command = new DeleteCommand({
      TableName: this.todosTable,
      Key: { userId, todoId }
    })

    await this.dynamoDBDocument.send(command)
  }

  async saveImgUrl({ userId, todoId, attachmentUrl }) {
    logger.info('Updating todo item image', { userId, todoId, attachmentUrl })

    const command = new UpdateCommand({
      TableName: this.todosTable,
      Key: { userId, todoId },
      ConditionExpression: 'attribute_exists(todoId)',
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl
      }
    })

    await this.dynamoDBDocument.send(command)
  }
}
