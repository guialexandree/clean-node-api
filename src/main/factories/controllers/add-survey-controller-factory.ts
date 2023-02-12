import { type Controller } from '@/presentation/protocols'
import { AddSurveyController } from '@/presentation/controllers'
import { makeSurveyValidation } from '@/main/factories/controllers'
import { makeDbAddSurvey } from '@/main/factories/usecases'
import { makeControllerDecorator } from '@/main/factories/decorator'

export const makeSurveyController = (): Controller => {
  const controller = new AddSurveyController(
    makeSurveyValidation(),
    makeDbAddSurvey()
  )

  return makeControllerDecorator(controller)
}
