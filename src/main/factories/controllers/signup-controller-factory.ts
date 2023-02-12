import { type Controller } from '@/presentation/protocols'
import { SignUpController } from '@/presentation/controllers/signup-controller'
import { makeAddAccount, makeAuthentication } from '@/main/factories/usecases'
import { makeControllerDecorator } from '@/main/factories/decorator'
import { makeSignUpValidation } from '@/main/factories/controllers'

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(
    makeAddAccount(),
    makeSignUpValidation(),
    makeAuthentication()
  )

  return makeControllerDecorator(controller)
}
