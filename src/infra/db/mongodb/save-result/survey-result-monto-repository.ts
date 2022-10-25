import { SaveSurveyResultRepository } from '@/data/protocols/db/survey/save-survey-result-repository'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultModel } from '@/domain/usecases/save-survey-result'
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
