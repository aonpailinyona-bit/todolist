import jwt from 'jsonwebtoken'

export function verifyToken(req: Request) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return null

  try {
    const secret = process.env.SECRET_KEY || 'defaultSecretKey'
    const payload = jwt.verify(token, secret) as any
    return payload
  } catch (err) {
    return null
  }
}
