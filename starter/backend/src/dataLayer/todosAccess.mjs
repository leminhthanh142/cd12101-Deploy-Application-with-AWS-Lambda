import AWSXray from 'aws-xray-sdk-core'

export class TodosAccess {
    constructor(dynamodb) {
        this.dynamodb = AWSXray.captureAWSv3Client(dynamodb)
    }
}