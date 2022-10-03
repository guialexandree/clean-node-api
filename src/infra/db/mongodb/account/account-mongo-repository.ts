import { ObjectId } from 'mongodb'
import {
	AddAccountRepository,
	AddAccountModel,
	AccountModel,
	LoadAccountByEmailRepository,
	UpdateAccessTokenRepository,
	MongoHelper
 } from './account-mongo-protocols'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository {
	async add (accountData: AddAccountModel) : Promise<AccountModel> {
		const accountCollection = await MongoHelper.getCollection('accounts')
		await accountCollection.insertOne(accountData)
		return MongoHelper.map(accountData)
	}

	async loadByEmail (email: string) : Promise<AccountModel> {
		const accountCollection = await MongoHelper.getCollection('accounts')
		const result = await accountCollection.findOne({ email })
		return result && MongoHelper.map(result)
	}

	async updateAccessToken (id: string, accessToken: string) : Promise<void> {
		const accountCollection = await MongoHelper.getCollection('accounts')
		const objectId = new ObjectId(id)
		await accountCollection.updateOne({
			_id: objectId
		}, {
			$set: {
				accessToken
			}
		})
	}
}
