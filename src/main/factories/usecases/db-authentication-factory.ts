import env from '@/main/config/env'
import { Authentication } from '@/domain/usecases'
import { DbAuthentication } from '@/data/usecases'
import { AccountMongoRepository } from '@/infra/db/mongodb'
import { BcryptAdapter, JwtAdapter } from '@/infra/criptography'

export const makeAuthentication = (): Authentication => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const jwtAdapter = new JwtAdapter(env.jwtSecret)

  return new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository
  )
}
