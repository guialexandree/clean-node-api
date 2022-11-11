import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'
import { ObjectId } from 'mongodb'
import {
  AddAccountRepository,
  AddAccountParams,
  AccountModel,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
  MongoHelper
} from './account-mongo-protocols'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository {
  async add (data: AddAccountParams): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.insertOne(data)
    return MongoHelper.map(data)
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
