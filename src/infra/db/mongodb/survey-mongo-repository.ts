import { SurveyModel } from '@/domain/models'
import { AddSurvey, LoadSurveyById } from '@/domain/usecases'
import { AddSurveyRepository, LoadSurveysRepository } from '@/data/protocols'
import { MongoHelper, QueryBuilder } from '@/infra/db/mongodb'
import { ObjectId } from 'mongodb'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyById {
  async add (data: AddSurvey.Params): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(data)
    return MongoHelper.map(data)
  }

	async loadAll (accoundId: string): Promise<SurveyModel[]> {
		const surveyCollection = await MongoHelper.getCollection('surveys')
		const query = new QueryBuilder()
			.lookup({
				from: 'surveyResults',
				foreignField: 'surveyId',
				localField: '_id',
				as: 'result'
			})
			.project({
				_id: 1,
				question: 1,
				answers: 1,
				date: 1,
				didAnswer: {
					$gte: [{
						$size: {
							$filter: {
								input: '$result',
								as: 'item',
								cond: {
									$eq: ['$$item.accountId', new ObjectId(accoundId)]
								}
							}
						}
					}, 1]
				}
			})
			.build()

		const surveys = await surveyCollection.aggregate(query).toArray()
		return surveys && MongoHelper.mapCollection(surveys)
	}

	async loadById (id: string): Promise<SurveyModel> {
		const surveyCollection = await MongoHelper.getCollection('surveys')
		const objectId = new ObjectId(id)
		const survey = await surveyCollection.findOne({ _id: objectId })
		return survey && MongoHelper.map(survey)
	}
}
