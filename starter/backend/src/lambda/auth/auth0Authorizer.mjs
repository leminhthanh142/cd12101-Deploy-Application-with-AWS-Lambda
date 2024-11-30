import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const jwksUrl = 'https://dev-ii6kr3ylqiw7d5ri.us.auth0.com/.well-known/jwks.json'

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  const jwt = jsonwebtoken.decode(token, { complete: true })
  if (!jwt) {
    throw new Error('Invalid token')
  }

  const { kid } = jwt.header

  const jwksResponse = await Axios.get(jwksUrl)
  const jwks = jwksResponse.data

  const signingKey = jwks.keys.find((key) => key.kid === kid)
  if (!signingKey) {
    throw new Error('Signing key not found')
  }

  const publicKey = getPublicKey(signingKey)

  return jsonwebtoken.verify(token, publicKey, { algorithms: ['RS256'] })
}

function getPublicKey(signingKey) {
  if (signingKey.x5c && signingKey.x5c.length > 0) {
    const cert = signingKey.x5c[0]
    return `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----`
  }

  if (signingKey.n && signingKey.e) {
    const key = {
      kty: signingKey.kty,
      n: signingKey.n,
      e: signingKey.e
    }
    return jsonwebtoken.jwkToPem(key)
  }

  throw new Error('Invalid signing key format')
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
