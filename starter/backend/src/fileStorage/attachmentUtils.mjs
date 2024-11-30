import * as AWS from 'aws-sdk'
import { TodoAccess } from '../dataLayer/todosAccess.mjs'

const todoAccess = new TodoAccess()

export async function generateUploadUrl({ userId, todoId }) {
  const bucketName = process.env.S3_BUCKET
  const urlExpiration = process.env.SIGNED_URL_EXPIRATION
  const s3 = new AWS.S3({ signatureVersion: 'v4' })
  const signedUrl = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: urlExpiration
  })
  await todoAccess.saveImgUrl({ userId, todoId, bucketName })
  return signedUrl
}
