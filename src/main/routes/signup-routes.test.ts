import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helpers'

describe('SignUp Routes', () => {
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

	test('Should return an account on success', async () => {
		await request(app)
			.post('/api/signup')
			.send({
				name: 'Guilherme Alexandre',
				email: 'guilherme_alexandre@hotmail.com',
				password: '_any_password',
				confirmPassword: '_any_password'
			})
			.expect(200)
	})
})
