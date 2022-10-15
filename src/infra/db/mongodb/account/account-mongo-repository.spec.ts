import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helpers'
import { AddAccountModel } from './account-mongo-protocols'
import { AccountMongoRepository } from './account-mongo-repository'

let accountCollection: Collection

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

const makeFakeAccount = (): AddAccountModel => ({
	id: 'any_id',
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
    await accountCollection.deleteMany({})
  })

	describe('add()', () => {
		test('Should return an account on success', async () => {
			const sut = makeSut()

			const account = await sut.add(makeFakeAccount())

			expect(account).toBeTruthy()
			expect(account.id).toBeTruthy()
			expect(account.name).toBe('any_name')
			expect(account.email).toBe('any_email')
			expect(account.password).toBe('any_password')
		})
	})

	describe('loadByEmail()', () => {
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
	})

	describe('updateAccessToken()', () => {
		test('Should update the account on updateAccessToken success', async () => {
			const sut = makeSut()
			const { insertedId } = await accountCollection.insertOne(makeFakeAccount())

			await sut.updateAccessToken(insertedId.toString(), 'any_token')
			const account = await accountCollection.findOne({ _id: insertedId })

			expect(account).toBeTruthy()
			expect(account?.accessToken).toBe('any_token')
		})

		test('Should throws if updateAccessToken throws', async () => {
			const sut = makeSut()
			const { insertedId } = await accountCollection.insertOne(makeFakeAccount())
			jest
				.spyOn(sut, 'updateAccessToken')
				.mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

			const promise = sut.updateAccessToken(insertedId.toString(), 'any_token')

			void expect(promise).rejects.toThrow()
		})
	})

	describe('loadAccountByToken()', () => {
		test('Should return account on loadAccountByToken with admin role', async () => {
			const sut = makeSut()

			await accountCollection.insertOne({
				...makeFakeAccount(),
				accessToken: 'any_token',
				role: 'admin'
			})
			const account = await sut.loadByToken('any_token', 'admin')

			expect(account).toBeTruthy()
			expect(account.id).toBeTruthy()
			expect(account.name).toBe('any_name')
			expect(account.email).toBe('any_email')
			expect(account.password).toBe('any_password')
		})

		test('Should return null on loadAccountByToken with invalid role', async () => {
			const sut = makeSut()

			await accountCollection.insertOne({
				...makeFakeAccount(),
				accessToken: 'any_token',
				role: 'client'
			})
			const account = await sut.loadByToken('any_token', 'admin')

			expect(account).toBeFalsy()
		})

		test('Should return an account on loadAccountByToken with if user is admin', async () => {
			const sut = makeSut()

			await accountCollection.insertOne({
				...makeFakeAccount(),
				accessToken: 'any_token',
				role: 'admin'
			})
			const account = await sut.loadByToken('any_token')

			expect(account).toBeTruthy()
			expect(account.id).toBeTruthy()
			expect(account.name).toBe('any_name')
			expect(account.email).toBe('any_email')
			expect(account.password).toBe('any_password')
		})

		test('Should return null if loadByToken fails', async () => {
			const sut = makeSut()

			const account = await sut.loadByToken('any_token')

			expect(account).toBeFalsy()
		})
	})
})
