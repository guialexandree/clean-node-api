import { Router } from 'express'
import { adaptRoute } from '@/main/adapters/express/express-route-adapter'
import { makeSignUpController } from '@/main/factories/signup/signup-factory'
import { makeSignInController } from '@/main/factories/signin/signin-factory'

export default (router: Router) : void => {
	router.post('/signup', adaptRoute(makeSignUpController()))
	router.post('/signin', adaptRoute(makeSignInController()))
}
