import { AddSurveyModel } from '@/domain/usecases/add-survey'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helpers'
import env from '@/main/config/env'
import request from 'supertest'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import MockDate from 'mockdate'

let surveyCollection: Collection
let accountCollection: Collection

const makeSurveyDate = (): AddSurveyModel => {
  return {
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }, {
        answer: 'other_answer'
      }
    ],
		date: new Date()
  }
}

describe('Login Routes', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const app = require('../config/app').default

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

		accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /survey', () => {
    test('Should return 403 on add survey without valid accessToken', async () => {
      await request(app)
        .post('/api/survey')
        .send(makeSurveyDate())
        .expect(403)
    })

		test('Should return 204 on add survey with valid accessToken', async () => {
      const res = await accountCollection.insertOne({
        name: 'Guilherme Alexandre',
        email: 'guilherme_alexandre@hotmail.com',
        password: '123',
				role: 'admin'
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

			await request(app)
        .post('/api/survey')
				.set('x-access-token', accessToken)
        .send(makeSurveyDate())
        .expect(204)
    })
  })
})
