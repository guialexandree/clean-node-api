import { LogErrorRepository } from '@/data/protocols'
import { MongoHelper } from '@/infra/db/mongodb'

export class LogMongoRepository implements LogErrorRepository {
  async logError (stack: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.insertOne({
      error: stack,
      date: new Date()
    })
  }
}
