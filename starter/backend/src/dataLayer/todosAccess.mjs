import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
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
        ':userId': userId
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

    const res = await this.dynamoDBDocument.send(command)
    return res
  }

  async updateTodo({ userId, todoId, updateData }) {
    logger.info('Updating todo item', { userId, todoId, updateData })

    const command = new UpdateCommand({
      TableName: this.todosTable,
      Key: { userId, todoId },
      ConditionExpression: 'attribute_exists(todoId)',
      UpdateExpression: 'set name = :name, dueDate = :dueDate, done = :done',
      ExpressionAttributeValues: {
        ':name': updateData.name,
        ':dueDate': updateData.dueDate,
        ':done': updateData.done
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

  async saveImgUrl({ userId, todoId, bucketName }) {
    logger.info('Updating todo item image', { userId, todoId, bucketName })

    const command = new UpdateCommand({
      TableName: this.todosTable,
      Key: { userId, todoId },
      ConditionExpression: 'attribute_exists(todoId)',
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': `https://${bucketName}.s3.amazonaws.com/${todoId}`
      }
    })

    await this.dynamoDBDocument.send(command)
  }
}
