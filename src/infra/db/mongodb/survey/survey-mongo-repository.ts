
import { AddSurveyModel, AddSurveyRepository, SurveyModel } from './survey-mongo-protocols'
import { MongoHelper } from '../helpers/mongo-helpers'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
    return MongoHelper.map(surveyData)
  }

	async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
		const surveys: SurveyModel[] = (await surveyCollection.find().toArray())
			.map(survey => MongoHelper.map(survey) as SurveyModel)

		return surveys
	}
}
