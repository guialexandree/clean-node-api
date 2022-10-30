import { mockFakeAddSurvey, throwError } from '@/domain/test'
import { DbAddSurvey, AddSurveyRepository } from './db-add-survey-protocols'
import { mockDbAddSurveyRepository } from '@/data/test/mock-db-survey'
import MockDate from 'mockdate'

interface SutTypes {
  sut: DbAddSurvey
  dbAddSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const dbAddSurveyRepositoryStub = mockDbAddSurveyRepository()
  const sut = new DbAddSurvey(dbAddSurveyRepositoryStub)

  return {
    sut,
    dbAddSurveyRepositoryStub
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
    const { sut, dbAddSurveyRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(dbAddSurveyRepositoryStub, 'add')

    await sut.add(mockFakeAddSurvey())

    expect(loadSpy).toHaveBeenCalledWith(mockFakeAddSurvey())
  })

  test('Should returns throws if DbAddSurveyRepository throws', async () => {
    const { sut, dbAddSurveyRepositoryStub } = makeSut()
    jest
      .spyOn(dbAddSurveyRepositoryStub, 'add')
      .mockImplementationOnce(throwError)

    const promise = sut.add(mockFakeAddSurvey())

    void expect(promise).rejects.toThrow(new Error())
  })
})
