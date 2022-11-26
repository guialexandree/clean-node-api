import { SurveyModel } from '@/domain/models'
import { AddSurvey } from '@/domain/usecases'
import { MongoHelper, SurveyMongoRepository } from '@/infra/db/mongodb'
import { mockAddAccountParams, mockAddSurveyParams } from '@/tests/domain/mocks'
import { Collection, ObjectId } from 'mongodb'
import MockDate from 'mockdate'
import ObjectID from 'bson-objectid'

let surveyCollection: Collection
let accountCollection: Collection
let surveyResultCollection: Collection

const makeAccount = async (): Promise<ObjectId> => {
	const account = await accountCollection.insertOne(mockAddAccountParams())

	return account.insertedId
}

const makeSurvey = async (data: AddSurvey.Params): Promise<SurveyModel> => {
	const result = await surveyCollection.insertOne(data)

	const survey = await surveyCollection.findOne<SurveyModel>({ _id: result.insertedId })
	return MongoHelper.map(survey)
}

const makeSurveyResult = async (answer: string, surveyId: ObjectId, accountId: ObjectId): Promise<void> => {
	await surveyResultCollection.insertOne({
		accountId,
		surveyId,
		answer,
		date: new Date()
	})
}

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

describe('SurveyMongoRepository', () => {
	beforeAll(async () => {
		await MongoHelper.connect(global.__MONGO_URI__)
		MockDate.set(new Date())
	})

	afterAll(async () => {
		await MongoHelper.disconnect()
		MockDate.reset()
	})

	beforeEach(async () => {
		accountCollection = await MongoHelper.getCollection('accounts')
		await accountCollection.deleteMany({})
		surveyResultCollection = await MongoHelper.getCollection('surveyResults')
		await surveyResultCollection.deleteMany({})
		surveyCollection = await MongoHelper.getCollection('surveys')
		await surveyCollection.deleteMany({})
	})

	describe('add()', () => {
		test('Should add a survey on success', async () => {
			const sut = makeSut()

			await sut.add(mockAddSurveyParams())

			const count = await surveyCollection.countDocuments()
			expect(count).toBe(1)
		})
	})

	describe('loadAll()', () => {
		test('Should load all surveys on success', async () => {
			const accountId = await makeAccount()
			const addSurveysModels = [mockAddSurveyParams(), mockAddSurveyParams()]
			const survey = await makeSurvey(addSurveysModels[0])
			await makeSurvey(addSurveysModels[1])

			await makeSurveyResult(
				survey.answers[0].answer,
				new ObjectId(survey.id),
				accountId
			)
			const sut = makeSut()

			const surveys = await sut.loadAll(accountId.toString())

			expect(surveys.length).toBe(2)
			expect(surveys[0].id).toBeTruthy()
			expect(surveys[0].question).toBe(addSurveysModels[0].question)
			expect(surveys[0].didAnswer).toBe(true)
			expect(surveys[1].question).toBe(addSurveysModels[1].question)
			expect(surveys[1].didAnswer).toBe(false)
		})

		test('Should load empty list', async () => {
			const accoundId = await makeAccount()
			const sut = makeSut()

			const surveys = await sut.loadAll(accoundId.toString())

			expect(surveys.length).toBe(0)
		})
	})

	describe('loadById()', () => {
		test('Should load survey by id on success', async () => {
			const { id } = await makeSurvey(mockAddSurveyParams())
			const sut = makeSut()

			const surveys = await sut.loadById(id)

			expect(surveys).toBeTruthy()
			expect(surveys.id).toBeTruthy()
		})

		test('Should return null if survey does not exists', async () => {
			const sut = makeSut()

			const answers = await sut.loadById(ObjectID().toHexString())

			expect(answers).toBeFalsy()
		})
	})

	describe('loadAnswers()', () => {
		test('Should load answers on success', async () => {
			const addSurveyParams = mockAddSurveyParams()
			const { id } = await makeSurvey(addSurveyParams)
			const sut = makeSut()

			const answers = await sut.loadAnswers(id)

			expect(answers).toEqual([
				addSurveyParams.answers[0].answer,
				addSurveyParams.answers[1].answer
			])
		})

		test('Should return empty array if survey does not exists', async () => {
			const sut = makeSut()

			const answers = await sut.loadAnswers(ObjectID().toHexString())

			expect(answers).toEqual([])
		})
	})

	describe('checkById()', () => {
		test('Should return true if survey exists', async () => {
			const { id } = await makeSurvey(mockAddSurveyParams())
			const sut = makeSut()

			const exists = await sut.checkById(id)

			expect(exists).toBe(true)
		})

		test('Should return false if survey not exists', async () => {
			const sut = makeSut()
			const fakeObjectId = ObjectID()

			const exists = await sut.checkById(fakeObjectId.toHexString())

			expect(exists).toBe(false)
		})
	})
})
