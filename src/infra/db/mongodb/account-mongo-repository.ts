import { type AddAccount } from '@/domain/usecases'
import { type AddAccountRepository, type CheckAccountByEmailRepository, type LoadAccountByEmailRepository, type LoadAccountByTokenRepository, type UpdateAccessTokenRepository } from '@/data/protocols/'
import { MongoHelper } from '@/infra/db/mongodb'
import { ObjectId } from 'mongodb'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository, CheckAccountByEmailRepository {
  async add (data: AddAccount.Params): Promise<AddAccountRepository.Result> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const newAccount = await accountCollection.insertOne(data)
    return newAccount.insertedId !== null
  }

  async loadByEmail (email: string): Promise<LoadAccountByEmailRepository.Result> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.findOne({
			email
		}, {
			projection: {
				_id: 1,
				name: 1,
				password: 1
			}
		})
    return result && MongoHelper.map(result)
  }

	async checkByEmail (email: string): Promise<CheckAccountByEmailRepository.Result> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.findOne({
			email
		}, {
			projection: {
				_id: 1
			}
		})
    return !!result && MongoHelper.map(result).id !== null
  }

  async updateAccessToken (id: string, accessToken: string): Promise<void> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const objectId = new ObjectId(id)
    await accountCollection.updateOne({
      _id: objectId
    }, {
      $set: {
        accessToken
      }
    })
  }

	async loadByToken (token: string, role?: string): Promise<LoadAccountByTokenRepository.Result> {
		const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.findOne({
			accessToken: token,
			$or: [{
				role
			}, {
				role: 'admin'
			}, {
				projection: {
					_id: 1
				}
			}]
		})
    return result && MongoHelper.map(result)
	}
}
