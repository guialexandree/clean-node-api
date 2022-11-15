import { AccountModel } from '@/domain/models'
import { AddAccount } from '@/domain/usecases'
import { AddAccountRepository, LoadAccountByEmailRepository, LoadAccountByTokenRepository, UpdateAccessTokenRepository } from '@/data/protocols/'
import { MongoHelper } from '@/infra/db/mongodb'
import { ObjectId } from 'mongodb'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository {
  async add (data: AddAccount.Params): Promise<AddAccountRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const newAccount = await accountCollection.insertOne(data)
    return newAccount.insertedId !== null
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.findOne({ email })
    return result && MongoHelper.map(result)
  }

  async updateAccessToken (id: string, accessToken: string): Promise<void> {
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

	async loadByToken (token: string, role?: string): Promise<AccountModel> {
		const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.findOne({
			accessToken: token,
			$or: [{
				role
			}, {
				role: 'admin'
			}]
		})
    return result && MongoHelper.map(result)
	}
}
