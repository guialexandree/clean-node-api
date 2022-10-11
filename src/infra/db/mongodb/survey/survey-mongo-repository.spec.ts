import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helpers'
import { SurveyMongoRepository } from './survey-mongo-repository'

let surveyCollection: Collection

const makeSut = () : SurveyMongoRepository => {
	return new SurveyMongoRepository()
}

const makeFakeAccount = () => ({
	name: 'any_name',
	email: 'any_email',
	password: 'any_password'
})

describe('Account Mongo Repository', () => {
	beforeAll(async () => {
		await MongoHelper.connect(global.__MONGO_URI__)
	})

	afterAll(async () => {
		await MongoHelper.disconnect()
	})

	beforeEach(async () => {
		surveyCollection = await MongoHelper.getCollection('surveys')
		surveyCollection.deleteMany({})
	})

	test('Should add a survey on  success', async () => {
		const sut = makeSut()
		await sut.add({
			question: 'any_question',
			answers: [
				{
					image: 'any_image',
					answer: 'any_answer'
				}, {
					answer: 'other_answer'
				}
			]
		})

		const survey = await surveyCollection.findOne({ question: 'any_question' })
		expect(survey).toBeTruthy()
	})
})
