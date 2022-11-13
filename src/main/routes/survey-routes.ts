import { Router } from 'express'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { makeSurveyController, makeLoadSurveysController } from '@/main/factories/controllers'
import { adminAuth } from '@/main/middlewares/admin-auth'
import { auth } from '@/main/middlewares/auth'

export default (router: Router): void => {
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
