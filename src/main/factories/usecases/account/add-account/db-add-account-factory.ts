import { AddAccount } from '@/domain/usecases/account/add-account'
import { DbAddAccount } from '@/data/usecases/account/add-account/db-add-account'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter'

export const makeAddAccount = (): AddAccount => {
  const bcryptAdapter = new BcryptAdapter()
  const accountMongoRepository = new AccountMongoRepository()

  return new DbAddAccount(
    bcryptAdapter,
    accountMongoRepository,
    accountMongoRepository
  )
}
