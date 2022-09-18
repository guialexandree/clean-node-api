import { Collection, Db, MongoClient } from 'mongodb'
import { AddAccountModel } from '../../../../domain/usecases/add-account'

export const MongoHelper = {
	client: null as unknown as MongoClient,
	db: null as unknown as Db,
	url: null as unknown as string,

	async connect (uri: string): Promise<void> {
		this.url = uri
		this.client = await MongoClient.connect(uri)
	},

	async disconnect (): Promise<void> {
		await this.client.close()
		this.client = null as unknown as MongoClient
	},

	async getCollection (name: string): Promise<Collection> {
		if (!this.client) {
			await this.connect(this.url)
		}
		return this.client.db().collection(name)
	},

	map (accountData: AddAccountModel, collectionResult: any) : any {
		const { insertedId } = collectionResult
		const { _id, ...dataResult } = accountData
		return Object.assign({}, { id: insertedId.toString() }, dataResult)
	}
}
