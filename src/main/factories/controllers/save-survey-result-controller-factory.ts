import { Controller } from '@/presentation/protocols'
import { SaveSurveyResultController } from '@/presentation/controllers'
import { makeDbLoadAnswersBySurvey, makeDbSaveSurveysResult } from '@/main/factories/usecases'
import { makeControllerDecorator } from '@/main/factories/decorator'

export const makeSaveSurveyResultController = (): Controller => {
	const loadAnswersBySurvey = makeDbLoadAnswersBySurvey()
	const saveSurveyResult = makeDbSaveSurveysResult()
  const controller = new SaveSurveyResultController(loadAnswersBySurvey, saveSurveyResult)

  return makeControllerDecorator(controller)
}
