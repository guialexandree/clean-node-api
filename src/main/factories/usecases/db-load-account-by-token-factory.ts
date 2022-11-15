import env from '@/main/config/env'
import { LoadAccountByToken } from '@/domain/usecases'
import { DbLoadAccountByToken } from '@/data/usecases'
import { AccountMongoRepository } from '@/infra/db/mongodb'
import { JwtAdapter } from '@/infra/criptography'

export const makeLoadAccountByToken = (): LoadAccountByToken => {
	const jwtAdapter = new JwtAdapter(env.jwtSecret)
	const accountMongoRepository = new AccountMongoRepository()

  return new DbLoadAccountByToken(
		jwtAdapter,
		accountMongoRepository)
}
