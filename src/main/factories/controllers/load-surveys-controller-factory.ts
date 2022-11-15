import { Controller } from '@/presentation/protocols'
import { LoadSurveysController } from '@/presentation/controllers'
import { makeDbLoadSurveys } from '@/main/factories/usecases'
import { makeControllerDecorator } from '@/main/factories/decorator'

export const makeLoadSurveysController = (): Controller => {
	const loadSurveys = makeDbLoadSurveys()
  const controller = new LoadSurveysController(loadSurveys)

  return makeControllerDecorator(controller)
}
