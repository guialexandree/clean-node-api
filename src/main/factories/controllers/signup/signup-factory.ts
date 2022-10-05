import { Controller } from '@/presentation/protocols'
import { SignUpController } from '@/presentation/controllers/login/signup/signup-controller'
import { makeSignUpValidation } from './signup-validation-factory'
import { makeAddAccount } from '../../usecases/add-account/add-account-factory'
import { makeAuthentication } from '../../usecases/authentication/authentication-factory'
import { makeControllerDecorator } from '../../decorator/log-controller-decoractor-factory'

export const makeSignUpController = () : Controller => {
	const controller = new SignUpController(
		makeAddAccount(),
		makeSignUpValidation(),
		makeAuthentication()
	)

	return makeControllerDecorator(controller)
}
