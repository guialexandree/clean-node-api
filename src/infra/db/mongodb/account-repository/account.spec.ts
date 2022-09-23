import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helpers'
import { AccountMongoRepository } from './account'

let accountCollection: Collection

const makeSut = () : AccountMongoRepository => {
	return new AccountMongoRepository()
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
		accountCollection = await MongoHelper.getCollection('accounts')
		accountCollection.deleteMany({})
	})

	test('Should return an account on success', async () => {
		const sut = makeSut()

		const account = await sut.add(makeFakeAccount())

		expect(account).toBeTruthy()
		expect(account.id).toBeTruthy()
		expect(account.name).toBe('any_name')
		expect(account.email).toBe('any_email')
		expect(account.password).toBe('any_password')
	})

	test('Should return account on loadByEmail success', async () => {
		const sut = makeSut()

		await accountCollection.insertOne(makeFakeAccount())
		const account = await sut.loadByEmail('any_email')

		expect(account).toBeTruthy()
		expect(account.id).toBeTruthy()
		expect(account.name).toBe('any_name')
		expect(account.email).toBe('any_email')
		expect(account.password).toBe('any_password')
	})

	test('Should return account on loadByEmail success', async () => {
		const sut = makeSut()

		await accountCollection.insertOne(makeFakeAccount())
		const account = await sut.loadByEmail('any_email')

		expect(account).toBeTruthy()
		expect(account.id).toBeTruthy()
		expect(account.name).toBe('any_name')
		expect(account.email).toBe('any_email')
		expect(account.password).toBe('any_password')
	})

	test('Should return null if loadByEmail fails', async () => {
		const sut = makeSut()

		const account = await sut.loadByEmail('any_email')

		expect(account).toBeFalsy()
	})

	test('Should update the account on updateAccessToken success', async () => {
		const sut = makeSut()
		const { insertedId } = await accountCollection.insertOne(makeFakeAccount())

		await sut.updateAccessToken(insertedId.toString(), 'any_token')
		const account = await accountCollection.findOne({ _id: insertedId })

		expect(account).toBeTruthy()
		expect(account?.accessToken).toBe('any_token')
	})
})
