import { DbLoadAnswersBySurvey } from '@/data/usecases'
import { LoadAnswersBySurveyRepositorySpy } from '@/tests/data/mocks'
import { throwError } from '@/tests/domain/mocks'
import faker from 'faker'

type SutTypes = {
	sut: DbLoadAnswersBySurvey
	loadAnswersBySurveyRepositoryStub: LoadAnswersBySurveyRepositorySpy
}

const makeSut = (): SutTypes => {
	const loadAnswersBySurveyRepositoryStub = new LoadAnswersBySurveyRepositorySpy()
	const sut = new DbLoadAnswersBySurvey(loadAnswersBySurveyRepositoryStub)

  return {
		sut,
		loadAnswersBySurveyRepositoryStub
	}
}

let surveyId: string

describe('DbLoadAnswersBySurvey UseCase', () => {
	beforeEach(() => {
    surveyId = faker.datatype.uuid()
  })

	test('Should call loadAnswersBySurveyRepository with correct id', async () => {
		const { sut, loadAnswersBySurveyRepositoryStub: loadSurveyByIdRepositoryStub } = makeSut()

		await sut.loadAnswers(surveyId)

		expect(loadSurveyByIdRepositoryStub.id).toBe(surveyId)
	})

	test('Should return answers on success', async () => {
		const { sut, loadAnswersBySurveyRepositoryStub } = makeSut()

		const answers = await sut.loadAnswers(surveyId)

		expect(answers).toEqual([
			loadAnswersBySurveyRepositoryStub.result[0],
			loadAnswersBySurveyRepositoryStub.result[1]
		])
	})

	test('Should return empty array if loadAnswersBySurveyRepository returns empty array', async () => {
		const { sut, loadAnswersBySurveyRepositoryStub } = makeSut()
		loadAnswersBySurveyRepositoryStub.result = []
		const answers = await sut.loadAnswers(surveyId)

		expect(answers).toEqual([])
	})

	test('Should throw if loadAnswersBySurveyRepository throws', async () => {
    const { sut, loadAnswersBySurveyRepositoryStub } = makeSut()
    jest
      .spyOn(loadAnswersBySurveyRepositoryStub, 'loadAnswers')
      .mockImplementationOnce(throwError)

    const promise = sut.loadAnswers(surveyId)

    await expect(promise).rejects.toThrow()
  })
})
