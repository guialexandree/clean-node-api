import { SignUpController } from '../../../presentation/controllers/signup/signup'
import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account'
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log'
import { makeSignInValidation } from './signin-validation'

export const makeSignInController = () : Controller => {
	const bcryptAdapter = new BcryptAdapter()
	const accountMongoRepository = new AccountMongoRepository()
	const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
	const signUpController = new SignUpController(dbAddAccount, makeSignInValidation())
	const logMongoRepository = new LogMongoRepository()

	return new LogControllerDecorator(signUpController, logMongoRepository)
}
