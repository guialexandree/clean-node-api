import { DbAddSurvey } from '@/data/usecases'
import { mockAddSurveyParams, throwError } from '@/tests/domain/mocks'
import { AddSurveyRepositorySpy } from '@/tests/data/mocks'
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
