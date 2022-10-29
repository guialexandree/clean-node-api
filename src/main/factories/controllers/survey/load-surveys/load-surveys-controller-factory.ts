import { Controller } from '@/presentation/protocols'
import { LoadSurveysController } from '@/presentation/controllers/survey/load-surveys/load-surveys.controller'
import { makeControllerDecorator } from '../../../decorator/log-controller-decoractor-factory'
import { makeDbLoadSurveys } from '@/main/factories/usecases/survey/load-surveys/db-load-surveys-factory'

export const makeLoadSurveysController = (): Controller => {
	const loadSurveys = makeDbLoadSurveys()
  const controller = new LoadSurveysController(loadSurveys)

  return makeControllerDecorator(controller)
}
