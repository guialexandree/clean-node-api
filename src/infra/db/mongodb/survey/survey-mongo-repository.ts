
import { AddSurveyModel, AddSurveyRepository } from './survey-mongo-protocols'
import { MongoHelper } from '../helpers/mongo-helpers'

export class SurveyMongoRepository implements AddSurveyRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
    return MongoHelper.map(surveyData)
  }
}
