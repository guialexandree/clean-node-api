import { Collection, Db, MongoClient } from 'mongodb'

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

  getCollection (name: string): Collection {
    return this.client.db().collection(name)
  },

  map (data: any): any {
    const { _id, ...rest } = data
    return Object.assign({}, { id: _id }, rest)
  },

	mapCollection (collection: any): any {
    return collection.map((item: any) => MongoHelper.map(item))
  }
}
