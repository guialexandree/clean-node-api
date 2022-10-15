import { Middleware } from '@/presentation/protocols'
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware'
import { makeLoadAccountByToken } from '../usecases/load-account-by-token/load-account-by-token-factory'

export const makeAuthMiddleware = (role?: string): Middleware => {
	const loadAccountByToken = makeLoadAccountByToken()
  return new AuthMiddleware(loadAccountByToken, role)
}
