import { Controller } from '@/presentation/protocols'
import { AddSurveyController } from '@/presentation/controllers/survey/add-survey/add-survey-controller'
import { makeSurveyValidation } from './survey-validation-factory'
import { makeControllerDecorator } from '../../decorator/log-controller-decoractor-factory'
import { makeAddSurvey } from '../../usecases/survey/survey-factory'

export const makeSurveyController = (): Controller => {
  const controller = new AddSurveyController(
    makeSurveyValidation(),
    makeAddSurvey()
  )

  return makeControllerDecorator(controller)
}
