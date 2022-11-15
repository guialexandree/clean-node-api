import { MongoHelper, AccountMongoRepository } from '@/infra/db/mongodb'

import { mockAddAccountParams, throwError } from '@/tests/domain/mocks'
import { Collection } from 'mongodb'
import faker from 'faker'

let accountCollection: Collection

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

describe('AccountMongoRepository', () => {
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
		test('Should return true if account created', async () => {
			const sut = makeSut()
			const addAccountParams = mockAddAccountParams()

			const isValid = await sut.add(addAccountParams)

			expect(isValid).toBe(true)
		})
	})

	describe('loadByEmail()', () => {
		test('Should return account on loadByEmail success', async () => {
			const sut = makeSut()
			const addAccountParams = mockAddAccountParams()
      await accountCollection.insertOne(addAccountParams)

      const account = await sut.loadByEmail(addAccountParams.email)

			expect(account).toBeTruthy()
			expect(account.id).toBeTruthy()
			expect(account.name).toBe(addAccountParams.name)
			expect(account.email).toBe(addAccountParams.email)
			expect(account.password).toBe(addAccountParams.password)
		})

		test('Should return null if loadByEmail fails', async () => {
			const sut = makeSut()

			const account = await sut.loadByEmail(faker.internet.email())

			expect(account).toBeFalsy()
		})
	})

	describe('updateAccessToken()', () => {
		test('Should update the account on success', async () => {
			const sut = makeSut()
			const addAccountParams = mockAddAccountParams()
			const { insertedId } = await accountCollection.insertOne(addAccountParams)
			const accessToken = faker.datatype.uuid()
			await sut.updateAccessToken(insertedId.toString(), accessToken)

			const account = await accountCollection.findOne({ _id: insertedId })

			expect(account).toBeTruthy()
			expect(account.accessToken).toBe(accessToken)
		})

		test('Should throws if updateAccessToken throws', async () => {
			const sut = makeSut()
			const addAccountParams = mockAddAccountParams()
			const { insertedId } = await accountCollection.insertOne(addAccountParams)
			jest
				.spyOn(sut, 'updateAccessToken')
				.mockReturnValueOnce(Promise.reject(throwError))

			const promise = sut.updateAccessToken(insertedId.toString(), 'any_token')

			await expect(promise).rejects.toThrow()
		})
	})

	describe('loadByToken()', () => {
    let name = faker.name.findName()
    let email = faker.internet.email()
    let password = faker.internet.password()
    let accessToken = faker.datatype.uuid()

    beforeEach(() => {
      name = faker.name.findName()
      email = faker.internet.email()
      password = faker.internet.password()
      accessToken = faker.datatype.uuid()
    })

		test('Should return account on loadByToken without role', async () => {
			const sut = makeSut()
			await accountCollection.insertOne({
				name,
				email,
				password,
				accessToken
			})

			const account = await sut.loadByToken(accessToken)

			expect(account).toBeTruthy()
			expect(account.id).toBeTruthy()
			expect(account.name).toBe(name)
			expect(account.email).toBe(email)
			expect(account.password).toBe(password)
		})

		test('Should return account on loadByToken with admin role', async () => {
			const sut = makeSut()
			await accountCollection.insertOne({
				name,
				email,
				password,
				accessToken,
				role: 'admin'
			})

			const account = await sut.loadByToken(accessToken, 'admin')

			expect(account).toBeTruthy()
			expect(account.id).toBeTruthy()
			expect(account.name).toBe(name)
			expect(account.email).toBe(email)
			expect(account.password).toBe(password)
		})

		test('Should return null on loadAccountByToken with invalid role', async () => {
			const sut = makeSut()
			await accountCollection.insertOne({
				name,
        email,
        password,
        accessToken
			})

			const account = await sut.loadByToken(accessToken, 'admin')

			expect(account).toBeFalsy()
		})

		test('Should return an account on loadAccountByToken with if user is admin', async () => {
			const sut = makeSut()
			await accountCollection.insertOne({
				name,
        email,
        password,
        accessToken,
				role: 'admin'
			})

			const account = await sut.loadByToken(accessToken)

			expect(account).toBeTruthy()
			expect(account.id).toBeTruthy()
			expect(account.name).toBe(name)
			expect(account.email).toBe(email)
			expect(account.password).toBe(password)
		})

		test('Should return null if loadByToken fails', async () => {
			const sut = makeSut()

			const account = await sut.loadByToken(accessToken)

			expect(account).toBeFalsy()
		})
	})
})
