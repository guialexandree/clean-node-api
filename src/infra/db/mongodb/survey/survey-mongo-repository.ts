
import { AddSurveyRepository, AddSurveyParams, SurveyModel, LoadSurveysRepository, LoadSurveyById } from './survey-mongo-protocols'
import { MongoHelper } from '../helpers/mongo-helpers'
import { ObjectId } from 'mongodb'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyById {
  async add (surveyData: AddSurveyParams): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
    return MongoHelper.map(surveyData)
  }

	async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
		const surveys = (await surveyCollection.find().toArray())
			.map(survey => MongoHelper.map(survey) as SurveyModel)

		return surveys && MongoHelper.mapCollection(surveys)
	}

	async loadById (id: string): Promise<SurveyModel> {
		const surveyCollection = await MongoHelper.getCollection('surveys')
		const objectId = new ObjectId(id)
		const survey = await surveyCollection.findOne({ _id: objectId })
		return survey && MongoHelper.map(survey)
	}
}
