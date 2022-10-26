import { SaveSurveyResultRepository, SurveyResultModel, SaveSurveyResultModel } from './survey-result-mongo-repository-protocols'
import { MongoHelper } from '../helpers/mongo-helpers'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
	async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
		const surveyCollectionCollection = await MongoHelper.getCollection('surveyResults')
    const surveyResults = await surveyCollectionCollection.findOneAndUpdate({
			surveyId: data.surveyId,
			accountId: data.accountId
		}, {
			$set: {
				answer: data.answer,
				date: data.date
			}
		}, {
			upsert: true,
			returnDocument: 'after'
		})
    return MongoHelper.map(surveyResults.value)
	}
}
