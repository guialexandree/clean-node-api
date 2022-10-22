
import { AddSurveyModel, AddSurveyRepository, SurveyModel } from './survey-mongo-protocols'
import { MongoHelper } from '../helpers/mongo-helpers'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { LoadSurveyById } from '@/domain/usecases/load-survey-by-id'
import { ObjectId } from 'mongodb'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyById {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
    return MongoHelper.map(surveyData)
  }

	async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
		const surveys = (await surveyCollection.find().toArray())
			.map(survey => MongoHelper.map(survey) as SurveyModel)

		return surveys
	}

	async loadById (id: string): Promise<SurveyModel> {
		const surveyCollection = await MongoHelper.getCollection('surveys')
		const objectId = new ObjectId(id)
		const survey = await surveyCollection.findOne({ _id: objectId })
		return MongoHelper.map(survey)
	}
}
