import { Router } from 'express'
import { adaptRoute } from '@/main/adapters/express/express-route-adapter'
import { makeSignUpController } from '@/main/factories/controllers/login/signup/signup-factory'
import { makeSignInController } from '@/main/factories/controllers/login/signin/signin-factory'

export default (router: Router) : void => {
	router.post('/signup', adaptRoute(makeSignUpController()))
	router.post('/signin', adaptRoute(makeSignInController()))
}
