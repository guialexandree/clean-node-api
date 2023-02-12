import { type Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { auth } from '../middlewares/auth'
import { makeSaveSurveyResultController, makeLoadSurveyResultController } from '@/main/factories/controllers'

export default (router: Router): void => {
  router.put(
		'/surveys/:surveyId/results',
		auth,
		adaptRoute(makeSaveSurveyResultController())
	)
	router.get(
		'/surveys/:surveyId/results',
		auth,
		adaptRoute(makeLoadSurveyResultController())
	)
}
