import request from 'supertest'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helpers'

let accountCollection: Collection

describe('Login Routes', () => {
	const app = require('../config/app').default

	beforeAll(async () => {
		await MongoHelper.connect(global.__MONGO_URI__)
	})

	afterAll(async () => {
		await MongoHelper.disconnect()
	})

	beforeEach(async () => {
		accountCollection = await MongoHelper.getCollection('accounts')
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

	describe('POST /signin', () => {
		test('Should return 200 on signin', async () => {
			const password = await hash('123', 12)
			accountCollection.insertOne({
				name: 'Guilherme Alexandre',
				email: 'guilherme_alexandre@hotmail.com',
				password
			})
			await request(app)
				.post('/api/signin')
				.send({
					email: 'guilherme_alexandre@hotmail.com',
					password: '123'
				})
				.expect(200)
		})

		test('Should return 401 if signin fails', async () => {
			const password = await hash('123', 12)
			accountCollection.insertOne({
				name: 'Guilherme Alexandre',
				email: 'guilherme_alexandre@hotmail.com',
				password
			})
			await request(app)
				.post('/api/signin')
				.send({
					email: 'guilherme_alexandre@hotmail.com',
					password: 'password_incorrect'
				})
				.expect(401)
		})
	})
})
