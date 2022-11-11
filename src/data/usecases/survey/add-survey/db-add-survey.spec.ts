import { mockAddSurveyParams, throwError } from '@/domain/test'
import { DbAddSurvey } from './db-add-survey-protocols'
import { AddSurveyRepositorySpy } from '@/data/test/mock-db-survey'
import MockDate from 'mockdate'

interface SutTypes {
  sut: DbAddSurvey
  dbAddSurveyRepositorySpy: AddSurveyRepositorySpy
}

const makeSut = (): SutTypes => {
  const dbAddSurveyRepositorySpy = new AddSurveyRepositorySpy()
  const sut = new DbAddSurvey(dbAddSurveyRepositorySpy)

  return {
    sut,
    dbAddSurveyRepositorySpy
  }
}

describe('DbAddSurvey Usecase', () => {
	beforeAll(() => {
		MockDate.set(new Date())
	})

	afterAll(() => {
		MockDate.reset()
	})

  test('Should call DbAddSurveyRepository with correct values', async () => {
    const { sut, dbAddSurveyRepositorySpy } = makeSut()
		const addSurveyData = mockAddSurveyParams()

    await sut.add(addSurveyData)

    expect(dbAddSurveyRepositorySpy.addSurveyParams).toEqual(addSurveyData)
  })

  test('Should returns throws if DbAddSurveyRepository throws', async () => {
    const { sut, dbAddSurveyRepositorySpy } = makeSut()
    jest
      .spyOn(dbAddSurveyRepositorySpy, 'add')
      .mockImplementationOnce(throwError)

    const promise = sut.add(mockAddSurveyParams())

    void expect(promise).rejects.toThrow(new Error())
  })
})
