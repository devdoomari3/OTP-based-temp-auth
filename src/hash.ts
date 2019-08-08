import * as crypto from 'crypto'

export function sha256(toHash: string) {
  return crypto.createHash('sha256')
    .update(toHash, 'utf8')
    .digest('base64')
}

export function sha512(toHash: string) {
  return crypto.createHash('sha512')
    .update(toHash, 'utf8')
    .digest('base64')
}