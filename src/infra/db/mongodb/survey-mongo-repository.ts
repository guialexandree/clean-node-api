import { SurveyModel } from '@/domain/models'
import { AddSurvey } from '@/domain/usecases'
import { AddSurveyRepository, CheckSurveyByIdRepository, LoadSurveyByIdRepository, LoadSurveysRepository } from '@/data/protocols'
import { MongoHelper, QueryBuilder } from '@/infra/db/mongodb'
import { ObjectId } from 'mongodb'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository, CheckSurveyByIdRepository {
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

	async loadById (id: string): Promise<LoadSurveyByIdRepository.Result> {
		const surveyCollection = await MongoHelper.getCollection('surveys')
		const objectId = new ObjectId(id)
		const survey = await surveyCollection.findOne({ _id: objectId })
		return survey && MongoHelper.map(survey)
	}

	async checkById (id: string): Promise<CheckSurveyByIdRepository.Result> {
		const surveyCollection = await MongoHelper.getCollection('surveys')
		const objectId = new ObjectId(id)
		const result = await surveyCollection.findOne({
			_id: objectId
		}, {
			projection: {
				_id: 1
			}
		})
		return !!result && MongoHelper.map(result).id !== null
	}
}
