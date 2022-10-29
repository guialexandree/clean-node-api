import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResult } from '@/domain/usecases/survey-result/save-survey-result'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { SaveSurveyResultController } from './save-survey-resut-controller'
import { LoadSurveyById, SurveyModel, HttpRequest } from './save-survey-resut-controller-protocols'
import MockDate from 'mockdate'

const makeFakeRequest = (): HttpRequest => ({
	params: {
		surveyId: 'any_survey_id'
	},
	body: {
		answer: 'any_answer'
	},
	accountId: 'any_account_id'
})

const makeLoadSurveyById = (): LoadSurveyById => {
	class LoadSurveyByIdStub implements LoadSurveyById {
		async loadById (id: string): Promise<SurveyModel> {
			return await new Promise(resolve => resolve(makeFakeSurvey()))
		}
	}

	return new LoadSurveyByIdStub()
}

const makeSaveSurveyResult = (): SaveSurveyResult => {
	class SaveSurveyResultStub implements SaveSurveyResult {
		async save (data: SurveyResultModel): Promise<SurveyResultModel> {
			return await new Promise(resolve => resolve(makeFakeSurveyResult()))
		}
	}

	return new SaveSurveyResultStub()
}

const makeFakeSurveyResult = (): SurveyResultModel => {
	return {
		id: 'valid_id',
		surveyId: 'valid_survey_id',
		accountId: 'valid_account_id',
		answer: 'valid_answer',
		date: new Date()
	}
}

const makeFakeSurvey = (): SurveyModel => {
	return {
		id: 'any_survey_id',
		question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }, {
        answer: 'other_answer'
      }
    ],
		date: new Date()
	}
}

type SutTypes = {
	sut: SaveSurveyResultController
	loadSurveyByIdStub: LoadSurveyById
	saveSurveyResultStub: SaveSurveyResult
}

const makeSut = (): SutTypes => {
	const loadSurveyByIdStub = makeLoadSurveyById()
	const saveSurveyResultStub = makeSaveSurveyResult()
	const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)

	return {
		sut,
		loadSurveyByIdStub,
		saveSurveyResultStub
	}
}

describe('SaveSurveyResult Controller', () => {
	beforeAll(() => {
		MockDate.set(new Date())
	})

	afterAll(() => {
		MockDate.reset()
	})

	test('Should call LoadSurveyById with correct values', async () => {
		const { sut, loadSurveyByIdStub } = makeSut()
		const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')

		await sut.handle(makeFakeRequest())

		expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
	})

	test('Should return 403 if LoadSurveyById returns null', async () => {
		const { sut, loadSurveyByIdStub } = makeSut()
		jest
			.spyOn(loadSurveyByIdStub, 'loadById')
			.mockReturnValueOnce(new Promise(resolve => resolve(null)))

		const httpResponse = await sut.handle(makeFakeRequest())

		expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
	})

	test('Should throw if LoadSurveyById throws', async () => {
		const { sut, loadSurveyByIdStub } = makeSut()
    jest
			.spyOn(loadSurveyByIdStub, 'loadById')
			.mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })

	test('Should return 403 if invalid answer is provided', async () => {
		const { sut } = makeSut()
		const fakeRequest = makeFakeRequest()
		fakeRequest.body.answer = 'invalid_answer'

		const httpResponse = await sut.handle(fakeRequest)

		expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
	})

	test('Should call SaveSurveyResult with correct values', async () => {
		const { sut, saveSurveyResultStub } = makeSut()
		const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')

		await sut.handle(makeFakeRequest())

		expect(saveSpy).toHaveBeenCalledWith({
			surveyId: 'any_survey_id',
			accountId: 'any_account_id',
			answer: 'any_answer',
			date: new Date()
		})
	})

	test('Should throw if SaveSurveyResult throws', async () => {
		const { sut, saveSurveyResultStub } = makeSut()
    jest
			.spyOn(saveSurveyResultStub, 'save')
			.mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })

	test('Should return 200 on success', async () => {
		const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(ok(makeFakeSurveyResult()))
  })
})
