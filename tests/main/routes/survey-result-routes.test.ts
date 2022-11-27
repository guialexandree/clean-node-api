import request from 'supertest'
import env from '@/main/config/env'
import { setupApp } from '@/main/config/app'
import { SurveyModel } from '@/domain/models/survey'
import { MongoHelper } from '@/infra/db/mongodb'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import MockDate from 'mockdate'
import { Express } from 'express'

let app: Express
let surveyCollection: Collection
let accountCollection: Collection

describe('Login Routes', () => {
  beforeAll(async () => {
		app = await setupApp()
    await MongoHelper.connect(global.__MONGO_URI__)
		MockDate.set(new Date())
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
		MockDate.reset()
  })

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})

		accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

	const createSurvey = async (): Promise<SurveyModel> => {
		const result = await surveyCollection.insertOne({
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
		})

		const survey = await surveyCollection.findOne<SurveyModel>({ _id: result.insertedId })
		return MongoHelper.map(survey)
	}

	const makeAccessToken = async (role?: string): Promise<string> => {
		const res = await accountCollection.insertOne({
			name: 'Guilherme Alexandre',
			email: 'guilherme_alexandre@hotmail.com',
			password: '123',
			role
		})
		const id = res.insertedId.toString()
		const accessToken = sign({ id }, env.jwtSecret)
		await accountCollection.updateOne({
			_id: res.insertedId
		}, {
			$set: {
				accessToken
			}
		})

		return accessToken
	}

  describe('POST /surveys/:surveyId/results', () => {
    test('Should return 403 on save survey without valid accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
					answer: 'any_answer'
				})
        .expect(403)
    })

		test('Should return 200 on save survey with valid accessToken', async () => {
			const accessToken = await makeAccessToken()
      const { id: surveyId } = await createSurvey()
			await request(app)
        .put(`/api/surveys/${surveyId}/results`)
				.set('x-access-token', accessToken)
        .send({
					answer: 'any_answer'
				})
        .expect(200)
    })
	})

	describe('GET /surveys/:surveyId/results', () => {
    test('Should return 403 on load survey without valid accessToken', async () => {
      await request(app)
        .get('/api/surveys/any_id/results')
        .expect(403)
    })

		test('Should return 200 on load survey with valid accessToken', async () => {
			const accessToken = await makeAccessToken()
      const { id: surveyId } = await createSurvey()
			await request(app)
        .get(`/api/surveys/${surveyId}/results`)
				.set('x-access-token', accessToken)
        .expect(200)
    })
	})
})
