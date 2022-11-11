import { SurveyModel, SurveyResultModel } from './survey-result-mongo-repository-protocols'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { Collection, ObjectId } from 'mongodb'
import { mockAddAccountParams, mockAddSurveyParams } from '@/domain/test'

let accountCollection: Collection
let surveyResultCollection: Collection
let surveyCollection: Collection

const makeSurvey = async (): Promise<SurveyModel> => {
	const result = await surveyCollection.insertOne(mockAddSurveyParams())

	const survey = await surveyCollection.findOne<SurveyModel>({ _id: result.insertedId })
	return MongoHelper.map(survey)
}

const makeAccount = async (): Promise<ObjectId> => {
	const account = await accountCollection.insertOne(mockAddAccountParams())

	return account.insertedId
}

const makeSurveyResult = async (answer: string, surveyId: ObjectId, accountId: ObjectId): Promise<void> => {
	await surveyResultCollection.insertOne({
		accountId,
		surveyId,
		answer,
		date: new Date()
	})
}

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

describe('SurveyMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

	describe('save()', () => {
		test('Should add an survey result if its new', async () => {
			const sut = makeSut()
			const survey = await makeSurvey()
			const accountId = await makeAccount()

			await sut.save({
				accountId: accountId.toString(),
				surveyId: survey.id,
				answer: survey.answers[1].answer,
				date: new Date()
			})

			const surveyResult = await surveyResultCollection.find<SurveyResultModel>({
				surveyId: new ObjectId(survey.id),
				accountId
			}).toArray()

			expect(surveyResult).toBeTruthy()
			expect(surveyResult.length).toBe(1)
		})

		test('Should update an survey result if its not new', async () => {
			const sut = makeSut()
			const survey = await makeSurvey()
			const accountId = await makeAccount()
			await makeSurveyResult(
				survey.answers[1].answer,
				accountId,
				new ObjectId(survey.id)
			)

			await sut.save({
				accountId: accountId.toString(),
				surveyId: survey.id,
				answer: survey.answers[1].answer,
				date: new Date()
			})

			const surveyResult = await surveyResultCollection.find<SurveyResultModel>({
				surveyId: new ObjectId(survey.id),
				accountId
			}).toArray()

			expect(surveyResult).toBeTruthy()
			expect(surveyResult.length).toBe(1)
		})
	})

	describe('loadBySurveyId()', () => {
		test('Should load an survey result', async () => {
			const sut = makeSut()
			const survey = await makeSurvey()
			const accountId = await makeAccount()
			await surveyResultCollection.insertMany([{
				accountId,
				surveyId: new ObjectId(survey.id),
				answer: survey.answers[0].answer,
				date: new Date()
			}, {
				accountId,
				surveyId: new ObjectId(survey.id),
				answer: survey.answers[0].answer,
				date: new Date()
			}])

			const surveyResult = await sut.loadBySurveyId(survey.id)

			expect(surveyResult.surveyId).toEqual(survey.id)
			expect(surveyResult.answers[0].percent).toBe(100)
			expect(surveyResult.answers[1].count).toBe(0)
			expect(surveyResult.answers[1].percent).toBe(0)
		})

		test('Should return null if there is no survey result', async () => {
			const sut = makeSut()
			const survey = await makeSurvey()
			const surveyResult = await sut.loadBySurveyId(survey.id)

			expect(surveyResult).toBeNull()
		})
	})
})
