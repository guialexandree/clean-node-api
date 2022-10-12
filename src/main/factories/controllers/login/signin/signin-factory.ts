import { Controller } from '@/presentation/protocols'
import { SignInController } from '@/presentation/controllers/login/signin/signin-controller'
import { makeSignInValidation } from './signin-validation-factory'
import { makeAuthentication } from '../../../usecases/authentication/authentication-factory'
import { makeControllerDecorator } from '../../../decorator/log-controller-decoractor-factory'

export const makeSignInController = (): Controller => {
  const controller = new SignInController(
    makeAuthentication(),
    makeSignInValidation()
  )

  return makeControllerDecorator(controller)
}
