import { SignUpController } from '../../../presentation/controllers/signup/signup-controller'
import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeSignInValidation } from './signin-validation-factory'

export const makeSignInController = () : Controller => {
	const bcryptAdapter = new BcryptAdapter()
	const accountMongoRepository = new AccountMongoRepository()
	const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
	const signUpController = new SignUpController(dbAddAccount, makeSignInValidation())
	const logMongoRepository = new LogMongoRepository()

	return new LogControllerDecorator(signUpController, logMongoRepository)
}
