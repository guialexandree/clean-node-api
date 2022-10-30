import { SurveyMongoRepository } from './survey-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helpers'
import { Collection } from 'mongodb'
import MockDate from 'mockdate'
import { mockFakeAddSurvey } from '@/domain/test'

let surveyCollection: Collection

const createSurveys = async (): Promise<void> => {
	await surveyCollection.insertMany([{
		question: 'any_question',
		answers: [
			{
				image: 'any_image',
				answer: 'any_answer'
			}, {
				answer: 'any_answer2'
			}
		],
		date: new Date()
	}, {
		question: 'other_question',
		answers: [
			{
				image: 'other_image',
				answer: 'other_answer'
			}, {
				answer: 'other_answer2'
			}
		],
		date: new Date()
	}])
}

const createSurvey = async (): Promise<string> => {
	const survey = await surveyCollection.insertOne(mockFakeAddSurvey())

	return survey.insertedId.toString()
}

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

describe('Account Mongo Repository', () => {
	beforeAll(async () => {
		await MongoHelper.connect(global.__MONGO_URI__)
		MockDate.set(new Date())
	})

	afterAll(async () => {
		await MongoHelper.disconnect()
		MockDate.reset()
	})

	beforeEach(async () => {
		surveyCollection = await MongoHelper.getCollection('surveys')
		await surveyCollection.deleteMany({})
	})

	describe('add()', () => {
		test('Should add a survey on success', async () => {
			const sut = makeSut()

			await sut.add(mockFakeAddSurvey())

			const result = await surveyCollection.findOne({ question: 'any_question' })
			const survey = MongoHelper.map(result)
			expect(survey).toBeTruthy()
			expect(survey.id).toBeTruthy()
		})
	})

	describe('loadAll()', () => {
		test('Should load all surveys on success', async () => {
			await createSurveys()
			const sut = makeSut()

			const surveys = await sut.loadAll()

			expect(surveys.length).toBe(2)
			expect(surveys[0].id).toBeTruthy()
			expect(surveys[0].question).toBe('any_question')
			expect(surveys[1].question).toBe('other_question')
		})

		test('Should load empty list', async () => {
			const sut = makeSut()

			const surveys = await sut.loadAll()

			expect(surveys.length).toBe(0)
		})
	})

	describe('loadById()', () => {
		test('Should load survey by id on success', async () => {
			const id = await createSurvey()
			const sut = makeSut()

			const surveys = await sut.loadById(id)

			expect(surveys).toBeTruthy()
			expect(surveys.id).toBeTruthy()
		})
	})
})
