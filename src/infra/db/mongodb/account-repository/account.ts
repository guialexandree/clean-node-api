import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo-helpers'

export class AccountMongoRepository implements AddAccountRepository {
	async add (accountData: AddAccountModel) : Promise<AccountModel> {
		const accountCollection = await MongoHelper.getCollection('accounts')
		const result = await accountCollection.insertOne(accountData)
		return MongoHelper.mapCreate(accountData, result)
	}

	async get (email: string) : Promise<AccountModel> {
		const accountCollection = await MongoHelper.getCollection('accounts')
		const result = await accountCollection.findOne({ email })
		return MongoHelper.map(result)
	}
}
