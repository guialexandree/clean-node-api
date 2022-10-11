import request from 'supertest'
import { AddSurveyModel } from '@/domain/usecases/add-survey'
import { Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helpers'

let surveyCollection: Collection

const makeSurveyDate = () : AddSurveyModel => {
	return {
		question: 'any_question',
		answers: [
			{
				image: 'any_image',
				answer: 'any_answer'
			}, {
				answer: 'other_answer'
			}
		]
	}
}

describe('Login Routes', () => {
	const app = require('../config/app').default

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

	describe('POST /survey', () => {
		test('Should return 204 on add survey', async () => {
			await request(app)
				.post('/api/survey')
				.send(makeSurveyDate())
				.expect(204)
		})
	})
})