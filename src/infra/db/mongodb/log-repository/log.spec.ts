import { MongoHelper } from '../helpers/mongo-helpers'
import { LogMongoRepository } from './log'

describe('Log Mongo Repository', () => {
	beforeAll(async () => {
		await MongoHelper.connect(global.__MONGO_URI__)
	})

	afterAll(async () => {
		await MongoHelper.disconnect()
	})

	beforeEach(async () => {
		const errorCollection = await MongoHelper.getCollection('errors')
		errorCollection.deleteMany({})
	})

	const makeSut = () : LogMongoRepository => {
		return new LogMongoRepository()
	}

	test('Should create an erro log on success', async () => {
		const sut = makeSut()
		await sut.logError('any_error')

		const errorCollection = await MongoHelper.getCollection('errors')
		const count = await errorCollection.countDocuments()

		expect(count).toBe(1)
	})
})
