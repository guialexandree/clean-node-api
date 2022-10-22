import env from '@/main/config/env'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import { LoadAccountByToken } from '@/domain/usecases/load-account-by-token'
import { DbLoadAccountByToken } from '@/data/usecases/account/load-account-by-token/db-load-account-by-token'
import { JwtAdapter } from '@/infra/criptography/jwt-adapter/jwt-adapter'

export const makeLoadAccountByToken = (): LoadAccountByToken => {
	const jwtAdapter = new JwtAdapter(env.jwtSecret)
	const accountMongoRepository = new AccountMongoRepository()

  return new DbLoadAccountByToken(
		jwtAdapter,
		accountMongoRepository)
}
