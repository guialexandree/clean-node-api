import { Router } from 'express'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { makeSurveyController } from '@/main/factories/controllers/survey/add-survey/add-survey-factory'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { makeLoadSurveysController } from '../factories/controllers/survey/load-surveys/load-surveys-factory'

export default (router: Router): void => {
	const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
	const auth = adaptMiddleware(makeAuthMiddleware())
  router.post(
		'/survey',
		adminAuth,
		adaptRoute(makeSurveyController())
	)
	router.get(
		'/surveys',
		auth,
		adaptRoute(makeLoadSurveysController())
	)
}
