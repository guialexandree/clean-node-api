import { CheckSurveyById } from '@/domain/usecases'
import { DbCheckSurveyById } from '@/data/usecases'
import { SurveyMongoRepository } from '@/infra/db/mongodb'

export const makeDbCheckSurveyById = (): CheckSurveyById => {
  const surveyMongoRepository = new SurveyMongoRepository()

  return new DbCheckSurveyById(surveyMongoRepository)
}
