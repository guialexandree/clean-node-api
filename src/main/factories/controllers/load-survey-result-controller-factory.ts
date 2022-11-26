import { Controller } from '@/presentation/protocols'
import { LoadSurveyResultController } from '@/presentation/controllers/'
import { makeDbCheckSurveyById, makeDbLoadSurveyResult } from '@/main/factories/usecases/'
import { makeControllerDecorator } from '@/main/factories/decorator'

export const makeLoadSurveyResultController = (): Controller => {
	const checkSurveyById = makeDbCheckSurveyById()
	const loadSurveyResult = makeDbLoadSurveyResult()
  const controller = new LoadSurveyResultController(checkSurveyById, loadSurveyResult)

  return makeControllerDecorator(controller)
}
