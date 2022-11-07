import { SurveyModel } from './survey-result-mongo-repository-protocols'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { Collection, ObjectId } from 'mongodb'

let accountCollection: Collection
let surveyResultCollection: Collection
let surveyCollection: Collection

const makeSurvey = async (): Promise<SurveyModel> => {
	const result = await surveyCollection.insertOne({
		question: 'any_question',
		answers: [
			{
				image: 'any_image',
				answer: 'any_answer_1'
			}, {
				answer: 'any_answer2'
			}, {
				answer: 'any_answer3'
			}
		],
		date: new Date()
	})

	const survey = await surveyCollection.findOne<SurveyModel>({ _id: result.insertedId })
	return MongoHelper.map(survey)
}

const makeAccount = async (): Promise<ObjectId> => {
	const account = await accountCollection.insertOne({
		name: 'any_name',
		email: 'any_email',
		password: 'any_password'
	})

	return account.insertedId
}

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

describe('Account Mongo Repository', () => {
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

			const surveyResult = await sut.save({
				accountId: accountId.toString(),
				surveyId: survey.id,
				answer: survey.answers[1].answer,
				date: new Date()
			})

			expect(surveyResult).toBeTruthy()
			expect(surveyResult.surveyId).toEqual(survey.id)
			expect(surveyResult.answers[0].answer).toBe(survey.answers[1].answer)
			expect(surveyResult.answers[0].count).toBe(1)
			expect(surveyResult.answers[0].percent).toBe(100)
		})

		test('Should update an survey result if its not new', async () => {
			const sut = makeSut()
			const survey = await makeSurvey()
			const accountId = await makeAccount()
			await surveyResultCollection.insertOne({
				accountId,
				surveyId: new ObjectId(survey.id),
				answer: survey.answers[0].answer,
				date: new Date()
			})

			const surveyResult = await sut.save({
				accountId: accountId.toString(),
				surveyId: survey.id,
				answer: survey.answers[1].answer,
				date: new Date()
			})

			expect(surveyResult.surveyId).toEqual(survey.id)
			expect(surveyResult.answers[0].answer).toBe(survey.answers[1].answer)
			expect(surveyResult.answers[0].count).toBe(1)
			expect(surveyResult.answers[0].percent).toBe(100)
			expect(surveyResult.answers[1].count).toBe(0)
			expect(surveyResult.answers[1].percent).toBe(0)
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
			}, {
				accountId,
				surveyId: new ObjectId(survey.id),
				answer: survey.answers[1].answer,
				date: new Date()
			}, {
				accountId,
				surveyId: new ObjectId(survey.id),
				answer: survey.answers[1].answer,
				date: new Date()
			}
			])

			const surveyResult = await sut.loadBySurveyId(survey.id)

			expect(surveyResult.surveyId).toEqual(survey.id)
			expect(surveyResult.answers[0].count).toBe(2)
			expect(surveyResult.answers[0].percent).toBe(50)
			expect(surveyResult.answers[1].count).toBe(2)
			expect(surveyResult.answers[1].percent).toBe(50)
			expect(surveyResult.answers[2].count).toBe(0)
			expect(surveyResult.answers[2].percent).toBe(0)
		})
	})
})
