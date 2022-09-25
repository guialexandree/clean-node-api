import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helpers'

describe('SignUp Routes', () => {
	const app = require('../config/app').default

	beforeAll(async () => {
		await MongoHelper.connect(global.__MONGO_URI__)
	})

	afterAll(async () => {
		await MongoHelper.disconnect()
	})

	beforeEach(async () => {
		const accountCollection = await MongoHelper.getCollection('accounts')
		accountCollection.deleteMany({})
	})

	describe('POST /signup', () => {
		test('Should return 200 on signup', async () => {
			await request(app)
				.post('/api/signup')
				.send({
					name: 'Guilherme Alexandre',
					email: 'guilherme_alexandre@hotmail.com',
					password: 'any_password',
					passwordConfirmation: 'any_password'
				})
				.expect(200)
		})
	})
})
