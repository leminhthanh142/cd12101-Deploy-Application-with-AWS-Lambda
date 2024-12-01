import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { TodoAccess } from "../dataLayer/todosAccess.mjs";

const todoAccess = new TodoAccess();

export async function generateUploadUrl({ userId, todoId }) {
  const bucketName = process.env.S3_BUCKET;
  const urlExpiration = process.env.SIGNED_URL_EXPIRATION;

  const s3Client = new S3Client({ region: process.env.AWS_REGION });

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: todoId,
  });

  const signedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: urlExpiration,
  });

  await todoAccess.saveImgUrl({ 
    userId, 
    todoId, 
    attachmentUrl: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${todoId}`
  });

  return signedUrl;
}
