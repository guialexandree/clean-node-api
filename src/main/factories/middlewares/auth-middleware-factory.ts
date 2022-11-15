import { Middleware } from '@/presentation/protocols'
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware'
import { makeLoadAccountByToken } from '@/main/factories/usecases'

export const makeAuthMiddleware = (role?: string): Middleware => {
	const loadAccountByToken = makeLoadAccountByToken()
  return new AuthMiddleware(loadAccountByToken, role)
}
