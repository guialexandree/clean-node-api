import { Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { makeSignInController, makeSignUpController } from '@/main/factories/controllers'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/signin', adaptRoute(makeSignInController()))
}
