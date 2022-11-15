import { Controller } from '@/presentation/protocols'
import { SaveSurveyResultController } from '@/presentation/controllers'
import { makeDbLoadSurveyById, makeDbSaveSurveysResult } from '@/main/factories/usecases'
import { makeControllerDecorator } from '@/main/factories/decorator'

export const makeSaveSurveyResultController = (): Controller => {
	const loadSurveyById = makeDbLoadSurveyById()
	const saveSurveyResult = makeDbSaveSurveysResult()
  const controller = new SaveSurveyResultController(loadSurveyById, saveSurveyResult)

  return makeControllerDecorator(controller)
}
