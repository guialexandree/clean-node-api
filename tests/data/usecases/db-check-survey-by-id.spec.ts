import { DbCheckSurveyById } from '@/data/usecases'
import { CheckSurveyByIdRepositorySpy } from '@/tests/data/mocks'
import { throwError } from '@/tests/domain/mocks'
import faker from 'faker'

type SutTypes = {
	sut: DbCheckSurveyById
	checkSurveyByIdRepositoryStub: CheckSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
	const checkSurveyByIdRepositoryStub = new CheckSurveyByIdRepositorySpy()
	const sut = new DbCheckSurveyById(checkSurveyByIdRepositoryStub)

  return {
		sut,
		checkSurveyByIdRepositoryStub
	}
}

let surveyId: string

describe('DbCheckSurveyById UseCase', () => {
	beforeEach(() => {
    surveyId = faker.datatype.uuid()
  })

	test('Should call CheckSurveyByIdRepository with correct id', async () => {
		const { sut, checkSurveyByIdRepositoryStub } = makeSut()

		await sut.checkById(surveyId)

		expect(checkSurveyByIdRepositoryStub.id).toBe(surveyId)
	})

	test('Should return true if CheckSurveyByIdRepository returns true', async () => {
		const { sut } = makeSut()

		const exists = await sut.checkById(surveyId)

		expect(exists).toBe(true)
	})

	test('Should return false if CheckSurveyByIdRepository returns false', async () => {
		const { sut, checkSurveyByIdRepositoryStub } = makeSut()
		checkSurveyByIdRepositoryStub.result = false
		const exists = await sut.checkById(surveyId)

		expect(exists).toBe(false)
	})

	test('Should throw if CheckSurveyByIdRepository throws', async () => {
    const { sut, checkSurveyByIdRepositoryStub: loadSurveyByIdRepositoryStub } = makeSut()
    jest
      .spyOn(loadSurveyByIdRepositoryStub, 'checkById')
      .mockImplementationOnce(throwError)

    const promise = sut.checkById(surveyId)

    await expect(promise).rejects.toThrow()
  })
})
