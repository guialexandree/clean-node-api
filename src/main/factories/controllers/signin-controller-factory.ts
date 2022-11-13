import { Controller } from '@/presentation/protocols'
import { SignInController } from '@/presentation/controllers'
import { makeAuthentication } from '@/main/factories/usecases'
import { makeSignInValidation } from '@/main/factories/controllers'
import { makeControllerDecorator } from '@/main/factories/decorator'

export const makeSignInController = (): Controller => {
  const controller = new SignInController(
    makeAuthentication(),
    makeSignInValidation()
  )

  return makeControllerDecorator(controller)
}
