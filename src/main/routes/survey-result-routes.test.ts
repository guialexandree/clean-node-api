import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helpers'
import request from 'supertest'
import { Collection } from 'mongodb'
import MockDate from 'mockdate'

let surveyCollection: Collection
let accountCollection: Collection

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

  describe('POST /surveys/:surveyId/results', () => {
    test('Should return 403 on save survey without valid accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
					answer: 'any_answer'
				})
        .expect(403)
    })
	})
})
