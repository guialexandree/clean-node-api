import { LoadSurveys } from '@/domain/usecases/load-surveys'
import { DbLoadSurveys } from '@/data/usecases/load-surveys/db-load-surveys'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export const makeLoadSurveys = (): LoadSurveys => {
  const surveyMongoRepository = new SurveyMongoRepository()

  return new DbLoadSurveys(surveyMongoRepository)
}
