import { Router } from 'express'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { makeSurveyController } from '@/main/factories/controllers/survey/add-survey/add-survey-factory'
import { makeLoadSurveysController } from '../factories/controllers/survey/load-surveys/load-surveys-factory'
import { adminAuth } from '../middlewares/admin-auth'
import { auth } from '../middlewares/auth'

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
