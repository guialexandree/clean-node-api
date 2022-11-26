import { SurveyModel, SurveyResultModel } from '@/domain/models'
import { MongoHelper, SurveyResultMongoRepository } from '@/infra/db/mongodb'
import { mockAddAccountParams, mockAddSurveyParams } from '@/tests/domain/mocks'
import { Collection, ObjectId } from 'mongodb'

let accountCollection: Collection
let surveyResultCollection: Collection
let surveyCollection: Collection

const makeSurvey = async (): Promise<SurveyModel> => {
	const result = await surveyCollection.insertOne(mockAddSurveyParams())

	const survey = await surveyCollection.findOne<SurveyModel>({ _id: result.insertedId })
	return MongoHelper.map(survey)
}

const makeAccount = async (): Promise<ObjectId> => {
	const account = await accountCollection.insertOne(mockAddAccountParams())

	return account.insertedId
}

const makeSurveyResult = async (answer: string, surveyId: ObjectId, accountId: ObjectId): Promise<void> => {
	await surveyResultCollection.insertOne({
		accountId,
		surveyId,
		answer,
		date: new Date()
	})
}

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

describe('SurveyMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
    surveyResultCollection = MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
    surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

	describe('save()', () => {
		test('Should add an survey result if its new', async () => {
			const sut = makeSut()
			const survey = await makeSurvey()
			const accountId = await makeAccount()

			await sut.save({
				accountId: accountId.toString(),
				surveyId: survey.id,
				answer: survey.answers[1].answer,
				date: new Date()
			})

			const surveyResult = await surveyResultCollection.find<SurveyResultModel>({
				surveyId: new ObjectId(survey.id),
				accountId
			}).toArray()

			expect(surveyResult).toBeTruthy()
			expect(surveyResult.length).toBe(1)
		})

		test('Should update an survey result if its not new', async () => {
			const sut = makeSut()
			const survey = await makeSurvey()
			const accountId = await makeAccount()
			await makeSurveyResult(
				survey.answers[1].answer,
				accountId,
				new ObjectId(survey.id)
			)

			await sut.save({
				accountId: accountId.toString(),
				surveyId: survey.id,
				answer: survey.answers[1].answer,
				date: new Date()
			})

			const surveyResult = await surveyResultCollection.find<SurveyResultModel>({
				surveyId: new ObjectId(survey.id),
				accountId
			}).toArray()

			expect(surveyResult).toBeTruthy()
			expect(surveyResult.length).toBe(1)
		})
	})

	describe('loadSurveyId()', () => {
		test('Should load an survey result', async () => {
			const sut = makeSut()
			const survey = await makeSurvey()
			const accountId = await makeAccount()
			const accountId2 = await makeAccount()
			await surveyResultCollection.insertMany([{
				accountId,
				surveyId: new ObjectId(survey.id),
				answer: survey.answers[0].answer,
				date: new Date()
			}, {
				accountId: accountId2,
				surveyId: new ObjectId(survey.id),
				answer: survey.answers[0].answer,
				date: new Date()
			}])

			const surveyResult = await sut.loadBySurveyId(survey.id, accountId.toString())

			expect(surveyResult.surveyId).toEqual(survey.id)
			expect(surveyResult.answers[0].count).toBe(2)
			expect(surveyResult.answers[0].percent).toBe(100)
			expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(true)
			expect(surveyResult.answers[1].count).toBe(0)
			expect(surveyResult.answers[1].percent).toBe(0)
			expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false)
		})

		test('Should load an survey result 2', async () => {
			const sut = makeSut()
			const survey = await makeSurvey()
			const accountId = await makeAccount()
			const accountId2 = await makeAccount()
			const accountId3 = await makeAccount()
			await surveyResultCollection.insertMany([{
				accountId,
				surveyId: new ObjectId(survey.id),
				answer: survey.answers[0].answer,
				date: new Date()
			}, {
				accountId: accountId2,
				surveyId: new ObjectId(survey.id),
				answer: survey.answers[1].answer,
				date: new Date()
			}, {
				accountId: accountId3,
				surveyId: new ObjectId(survey.id),
				answer: survey.answers[1].answer,
				date: new Date()
			}])

			const surveyResult = await sut.loadBySurveyId(survey.id, accountId2.toString())

			expect(surveyResult.surveyId).toEqual(survey.id)
			expect(surveyResult.answers[0].count).toBe(2)
			expect(surveyResult.answers[0].percent).toBe(67)
			expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(true)
			expect(surveyResult.answers[1].count).toBe(1)
			expect(surveyResult.answers[1].percent).toBe(33)
			expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false)
		})

		test('Should load an survey result 3', async () => {
			const sut = makeSut()
			const survey = await makeSurvey()
			const accountId = await makeAccount()
			const accountId2 = await makeAccount()
			const accountId3 = await makeAccount()
			await surveyResultCollection.insertMany([{
				accountId,
				surveyId: new ObjectId(survey.id),
				answer: survey.answers[0].answer,
				date: new Date()
			}, {
				accountId: accountId2,
				surveyId: new ObjectId(survey.id),
				answer: survey.answers[1].answer,
				date: new Date()
			}])

			const surveyResult = await sut.loadBySurveyId(survey.id, accountId3.toString())

			expect(surveyResult.surveyId).toEqual(survey.id)
			expect(surveyResult.answers[0].count).toBe(1)
			expect(surveyResult.answers[0].percent).toBe(50)
			expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(false)
			expect(surveyResult.answers[1].count).toBe(1)
			expect(surveyResult.answers[1].percent).toBe(50)
			expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false)
		})

		test('Should return null if there is no survey result', async () => {
			const sut = makeSut()
			const accountId = await makeAccount()
			const survey = await makeSurvey()

			const surveyResult = await sut.loadBySurveyId(survey.id, accountId.toString())

			expect(surveyResult).toBeNull()
		})
	})
})
