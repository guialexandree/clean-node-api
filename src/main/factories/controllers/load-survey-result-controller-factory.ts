import { Controller } from '@/presentation/protocols'
import { LoadSurveyResultController } from '@/presentation/controllers/'
import { makeDbLoadSurveyById, makeDbLoadSurveyResult } from '@/main/factories/usecases/'
import { makeControllerDecorator } from '@/main/factories/decorator'

export const makeLoadSurveyResultController = (): Controller => {
	const loadSurveyById = makeDbLoadSurveyById()
	const loadSurveyResult = makeDbLoadSurveyResult()
  const controller = new LoadSurveyResultController(loadSurveyById, loadSurveyResult)

  return makeControllerDecorator(controller)
}
