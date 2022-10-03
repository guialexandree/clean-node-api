import env from '@/main/config/env'
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator'
import { DbAuthentication } from '@/data/usecases/authentication/db-authentication'
import { LogMongoRepository } from '@/infra/db/mongodb/log/log-mongo-repository'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '@/infra/criptography/jwt-adapter/jwt-adapter'
import { Controller } from '@/presentation/protocols'
import { SignInController } from '@/presentation/controllers/signin/signin-controller'
import { makeSignInValidation } from './signin-validation-factory'

export const makeSignInController = () : Controller => {
	const salt = 12
	const bcryptAdapter = new BcryptAdapter(salt)
	const accountMongoRepository = new AccountMongoRepository()
	const jwtAdapter = new JwtAdapter(env.jwtSecret)

	const dbAuthentication = new DbAuthentication(
		accountMongoRepository,
		bcryptAdapter,
		jwtAdapter,
		accountMongoRepository
	)

	const signInController = new SignInController(dbAuthentication, makeSignInValidation())
	const logMongoRepository = new LogMongoRepository()

	return new LogControllerDecorator(signInController, logMongoRepository)
}
