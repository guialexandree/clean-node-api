import { Collection, Db, MongoClient } from 'mongodb'
import { AddAccountModel } from '../../../../domain/usecases/add-account'

export const MongoHelper = {
	client: null as unknown as MongoClient,
	db: null as unknown as Db,

	async connect (uri: string): Promise<void> {
		this.client = await MongoClient.connect(uri)
	},

	async disconnect (): Promise<void> {
		await this.client.close()
	},

	getCollection (name: string): Collection {
		return this.client.db().collection(name)
	},

	map (accountData: AddAccountModel, collectionResult: any) : any {
		const { insertedId } = collectionResult
		return Object.assign({}, accountData, { id: insertedId.toString() })
	}
}