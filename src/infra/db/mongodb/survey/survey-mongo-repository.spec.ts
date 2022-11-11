import { SurveyMongoRepository } from './survey-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { Collection } from 'mongodb'
import MockDate from 'mockdate'
import { mockAddSurveyParams } from '@/domain/test'

let surveyCollection: Collection

const createSurvey = async (): Promise<string> => {
	const survey = await surveyCollection.insertOne(mockAddSurveyParams())

	return survey.insertedId.toString()
}

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

describe('SurveyMongoRepository', () => {
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

			await sut.add(mockAddSurveyParams())

			const count = await surveyCollection.countDocuments()
			expect(count).toBe(1)
		})
	})

	describe('loadAll()', () => {
		test('Should load all surveys on success', async () => {
			const addSurveysModels = [mockAddSurveyParams(), mockAddSurveyParams()]
			await surveyCollection.insertMany(addSurveysModels)
			const sut = makeSut()

			const surveys = await sut.loadAll()

			expect(surveys.length).toBe(2)
			expect(surveys[0].id).toBeTruthy()
			expect(surveys[0].question).toBe(addSurveysModels[0].question)
			expect(surveys[1].question).toBe(addSurveysModels[1].question)
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
