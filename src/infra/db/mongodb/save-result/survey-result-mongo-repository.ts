import { SaveSurveyResultRepository, SurveyResultModel, SaveSurveyResultParams } from './survey-result-mongo-repository-protocols'
import { MongoHelper } from '../helpers/mongo-helper'
import { ObjectId } from 'mongodb'
import { QueryBuilder } from '../helpers'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
	async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
		const surveyCollectionCollection = await MongoHelper.getCollection('surveyResults')
    await surveyCollectionCollection.findOneAndUpdate({
			surveyId: new ObjectId(data.surveyId),
			accountId: new ObjectId(data.accountId)
		}, {
			$set: {
				answer: data.answer,
				date: data.date
			}
		}, {
			upsert: true
		})
		const surveyResults = await this.loadBySurveyId(data.surveyId)
    return surveyResults
	}

	private async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
		const surveyCollectionCollection = await MongoHelper.getCollection('surveyResults')
    const query = new QueryBuilder()
			.match({
				surveyId: new ObjectId(surveyId)
			})
			.group({
				_id: 0,
				data: {
					$push: '$$ROOT'
				},
				count: {
					$sum: 1
				}
			})
			.unwind({
				path: '$data'
			})
			.lookup({
					from: 'surveys',
					localField: 'data.surveyId',
					foreignField: '_id',
					as: 'survey'
				}
			)
			.unwind({
				path: '$survey'
			})
			.group({
				_id: {
					surveyId: '$survey._id',
					question: '$survey.question',
					date: '$survey.date',
					total: '$count',
					answer: {
						$filter: {
							input: '$survey.answers',
							cond: {
								$eq: [
									'$$item.answer', '$data.answer'
								]
							},
							as: 'item'
						}
					}
				},
				count: {
					$sum: 1
				}
			})
			.unwind({
					path: '$_id.answer'
				}
			)
			.addFields({
				'_id.answer.count': '$count',
				'_id.answer.percent': {
					$multiply: [
						{
							$divide: [
								'$count', '$_id.total'
							]
						}, 100
					]
				}
			})
			.group({
				_id: {
					surveyId: '$_id.surveyId',
					question: '$_id.question',
					date: '$_id.date'
				},
				answers: {
					$push: '$_id.answer'
				}
			})
			.project({
				_id: 0,
				surveyId: '$_id.surveyId',
				question: '$_id.question',
				date: '$_id.date',
				answers: '$answers'
			})
			.build()

		const surveyResult = await surveyCollectionCollection.aggregate<SurveyResultModel>(query).toArray()
		return !!surveyResult?.length && surveyResult[0]
	}
}
