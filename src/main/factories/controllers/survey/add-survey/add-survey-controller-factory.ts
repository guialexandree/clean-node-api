import { Controller } from '@/presentation/protocols'
import { AddSurveyController } from '@/presentation/controllers/survey/add-survey/add-survey-controller'
import { makeSurveyValidation } from './add-survey-validation-factory'
import { makeControllerDecorator } from '../../../decorator/log-controller-decoractor-factory'
import { makeDbAddSurvey } from '../../../usecases/survey/add-survey/db-add-survey-factory'

export const makeSurveyController = (): Controller => {
  const controller = new AddSurveyController(
    makeSurveyValidation(),
    makeDbAddSurvey()
  )

  return makeControllerDecorator(controller)
}
