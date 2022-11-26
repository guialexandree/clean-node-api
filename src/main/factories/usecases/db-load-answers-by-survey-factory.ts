import { LoadAnswersBySurvey } from '@/domain/usecases'
import { DbLoadAnswersBySurvey } from '@/data/usecases'
import { SurveyMongoRepository } from '@/infra/db/mongodb'

export const makeDbLoadAnswersBySurvey = (): LoadAnswersBySurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()

  return new DbLoadAnswersBySurvey(surveyMongoRepository)
}
