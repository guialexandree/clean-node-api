import { MongoHelper } from '@/infra/db/mongodb'
import { setupApp } from '@/main/config/app'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import { Express } from 'express'
import request from 'supertest'

let accountCollection: Collection
let app: Express

describe('Login GraphQL', () => {
	beforeAll(async () => {
    app = await setupApp()
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

	describe('Login Query', () => {
		const query = `query {
      login (email: "guilherme_alexandre@hotmail.com", password: "123") {
        accessToken
        name
      }
    }`

		test('Should return an Account on valid credentials', async () => {
			const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'Guilherme Alexandre',
        email: 'guilherme_alexandre@hotmail.com',
        password
      })

			const res = await request(app)
        .post('/graphql')
        .send({ query })

      expect(res.status).toBe(200)
      expect(res.body.data.login.accessToken).toBeTruthy()
      expect(res.body.data.login.name).toBe('Guilherme Alexandre')
		})

		test('Should return Unauthorized on invalid credentials', async () => {
			const res = await request(app)
        .post('/graphql')
        .send({ query })

      expect(res.status).toBe(401)
      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe('Unauthorized')
		})
	})
})
