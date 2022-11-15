import { SurveyResultModel } from '@/domain/models'
import { SaveSurveyResultParams } from '@/domain/usecases'
import { LoadSurveyResultRepository, SaveSurveyResultRepository } from '@/data/protocols'
import { MongoHelper, QueryBuilder } from '@/infra/db/mongodb'
import { ObjectId } from 'mongodb'
import round from 'mongo-round'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository, LoadSurveyResultRepository {
	async save (data: SaveSurveyResultParams): Promise<void> {
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
	}

	public async loadBySurveyId (surveyId: string, accountId: string): Promise<SurveyResultModel> {
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
				total: {
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
			})
			.unwind({
				path: '$survey'
			})
			.group({
				_id: {
					surveyId: '$survey._id',
					question: '$survey.question',
					date: '$survey.date',
					total: '$total',
					answer: '$data.answer',
					answers: '$survey.answers'
				},
				count: {
					$sum: 1
				},
				currentAccountAnswer: {
					$push: {
						$cond: [{ $eq: ['$data.accountId', new ObjectId(accountId)] }, '$data.answer', null]
					}
				}
			})
			.project({
				_id: 0,
				surveyId: '$_id.surveyId',
				question: '$_id.question',
				date: '$_id.date',
				answers: {
					$map: {
						input: '$_id.answers',
						as: 'item',
						in: {
							$mergeObjects: [
								'$$item',
								{
									count: {
										$cond: {
											if: {
												$eq: [
												'$$item.answer',
												'$_id.answer'
												]
											},
											then: '$count',
											else: 0
										}
									},
									percent: {
										$cond: {
											if: {
												$eq: [
													'$$item.answer',
													'$_id.answer'
												]
											},
											then: {
												$multiply: [
												{
													$divide: [
														'$count',
														'$_id.total'
													]
												}, 100]
											},
											else: 0
										}
									},
									isCurrentAccountAnswer: {
										$eq: ['$$item.answer', {
											$arrayElemAt: ['$currentAccountAnswer', 0]
										}]
									}
								}
							]
						}
					}
				}
			})
			.group({
				_id: {
					surveyId: '$surveyId',
					question: '$question',
					date: '$date'
				},
				answers: {
					$push: '$answers'
				}
			})
			.project({
				_id: 0,
				surveyId: '$_id.surveyId',
				question: '$_id.question',
				date: '$_id.date',
				answers: {
					$reduce: {
						input: '$answers',
						initialValue: [],
						in: {
							$concatArrays: [
								'$$value',
								'$$this'
							]
						}
					}
				}
			})
			.unwind({
				path: '$answers'
			})
			.group({
				_id: {
					surveyId: '$surveyId',
					question: '$question',
					date: '$date',
					answer: '$answers.answer',
					image: '$answers.image',
					isCurrentAccountAnswer: '$answers.isCurrentAccountAnswer'
				},
				count: {
					$sum: '$answers.count'
				},
				percent: {
					$sum: '$answers.percent'
				}
			})
			.project({
				surveyId: '$_id.surveyId',
				question: '$_id.question',
				date: '$_id.date',
				answers: {
					answer: '$_id.answer',
					image: '$_id.image',
					count: round('$count'),
					percent: round('$percent'),
					isCurrentAccountAnswer: '$_id.isCurrentAccountAnswer'
				}
			})
			.sort({
				'answers.count': -1
			})
			.group({
				_id: {
					surveyId: '$surveyId',
					question: '$question',
					date: '$date'
				},
				answers: {
					$push: '$answers'
				}
			})
			.project({
				surveyId: '$_id.surveyId',
				question: '$_id.question',
				date: '$_id.date',
				answers: '$answers'
			})
			.build()

		const surveyResult = await surveyCollectionCollection.aggregate<SurveyResultModel>(query).toArray()
		return surveyResult.length ? surveyResult[0] : null
	}
}
