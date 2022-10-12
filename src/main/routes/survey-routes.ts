import { Router } from 'express'
import { adaptRoute } from '@/main/adapters/express/express-route-adapter'
import { makeSurveyController } from '@/main/factories/controllers/survey/survey-factory'

export default (router: Router): void => {
  router.post('/survey', adaptRoute(makeSurveyController()))
}
