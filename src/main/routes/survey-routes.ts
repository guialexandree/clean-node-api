import { Router } from 'express'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { makeSurveyController } from '@/main/factories/controllers/survey/add-survey-factory'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'

export default (router: Router): void => {
	const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
  router.post(
		'/survey',
		adminAuth,
		adaptRoute(makeSurveyController())
	)
}
