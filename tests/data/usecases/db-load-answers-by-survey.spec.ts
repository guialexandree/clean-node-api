import { DbLoadAnswersBySurvey } from '@/data/usecases'
import { LoadSurveyByIdRepositorySpy } from '@/tests/data/mocks'
import { throwError } from '@/tests/domain/mocks'
import faker from 'faker'

type SutTypes = {
	sut: DbLoadAnswersBySurvey
	loadSurveyByIdRepositoryStub: LoadSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
	const loadSurveyByIdRepositoryStub = new LoadSurveyByIdRepositorySpy()
	const sut = new DbLoadAnswersBySurvey(loadSurveyByIdRepositoryStub)

  return {
		sut,
		loadSurveyByIdRepositoryStub
	}
}

let surveyId: string

describe('DbLoadAnswersBySurvey UseCase', () => {
	beforeEach(() => {
    surveyId = faker.datatype.uuid()
  })

	test('Should call LoadSurveyByIdRepository with correct id', async () => {
		const { sut, loadSurveyByIdRepositoryStub } = makeSut()

		await sut.loadAnswers(surveyId)

		expect(loadSurveyByIdRepositoryStub.id).toBe(surveyId)
	})

	test('Should return answers on success', async () => {
		const { sut, loadSurveyByIdRepositoryStub } = makeSut()

		const answers = await sut.loadAnswers(surveyId)

		expect(answers).toEqual([
			loadSurveyByIdRepositoryStub.result.answers[0].answer,
			loadSurveyByIdRepositoryStub.result.answers[1].answer
		])
	})

	test('Should return empty array if loadSurveyByIdRepository returns null', async () => {
		const { sut, loadSurveyByIdRepositoryStub } = makeSut()
		loadSurveyByIdRepositoryStub.result = null
		const answers = await sut.loadAnswers(surveyId)

		expect(answers).toEqual([])
	})

	test('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest
      .spyOn(loadSurveyByIdRepositoryStub, 'loadById')
      .mockImplementationOnce(throwError)

    const promise = sut.loadAnswers(surveyId)

    await expect(promise).rejects.toThrow()
  })
})
