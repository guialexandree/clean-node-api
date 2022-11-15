import { AddAccount } from '@/domain/usecases'
import { DbAddAccount } from '@/data/usecases'
import { AccountMongoRepository } from '@/infra/db/mongodb'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter'

export const makeAddAccount = (): AddAccount => {
  const bcryptAdapter = new BcryptAdapter()
  const accountMongoRepository = new AccountMongoRepository()

  return new DbAddAccount(
    bcryptAdapter,
    accountMongoRepository,
    accountMongoRepository
  )
}
