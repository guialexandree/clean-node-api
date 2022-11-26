import { MongoHelper, LogMongoRepository } from '@/infra/db/mongodb'
import faker from 'faker'

describe('LogMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const errorCollection = MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })

  const makeSut = (): LogMongoRepository => {
    return new LogMongoRepository()
  }

  test('Should create an erro log on success', async () => {
    const sut = makeSut()
    await sut.logError(faker.random.words())

    const errorCollection = MongoHelper.getCollection('errors')
    const count = await errorCollection.countDocuments()

    expect(count).toBe(1)
  })
})
