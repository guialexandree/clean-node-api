import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo-helpers'

export class AccountMongoRepository implements AddAccountRepository {
	async add (accountData: AddAccountModel) : Promise<AccountModel> {
		const accountCollection = MongoHelper.getCollection('accounts')
		const { insertedId } = await accountCollection.insertOne(accountData)
		return { ...accountData, id: insertedId.toString() }
	}
}
