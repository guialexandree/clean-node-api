import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo-helpers'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/load-accound-by-email-repository'
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/update-access-token-repository'
import { ObjectId } from 'mongodb'

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
		const objectId = new ObjectId(id);
		await accountCollection.updateOne({
			_id: objectId
		}, {
			$set: {
				accessToken
			}
		})
	}
}
