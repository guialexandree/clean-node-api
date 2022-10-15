import { LoadSurveys, SurveyModel } from './load-surveys-controller-protocols'
import { LoadSurveysController } from './load-surveys.controller'
import { ok } from '@/presentation/helpers/http/http-helper'
import MockDate from 'mockdate'

const makeLoadSurveys = (): LoadSurveys => {
	class LoadSurveysStub implements LoadSurveys {
		async load (): Promise<SurveyModel[]> {
			return await new Promise(resolve => resolve(makeFakeSurveys()))
		}
	}

	return new LoadSurveysStub()
}

const makeFakeSurveys = (): SurveyModel[] => {
	return [{
		id: 'any_id',
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
	}, {
		id: 'other_id',
		question: 'other_question',
    answers: [
      {
        image: 'other_image',
        answer: 'other_answer'
      }, {
        answer: 'other_answer'
      }
    ],
		date: new Date()
	}]
}

type SutTypes = {
	sut: LoadSurveysController
	loadSurveysStub: LoadSurveys
}

const makeSut = (): SutTypes => {
	const loadSurveysStub = makeLoadSurveys()
	const sut = new LoadSurveysController(loadSurveysStub)

	return {
		sut,
		loadSurveysStub
	}
}

describe('LoadSurveys Controller', () => {
	beforeAll(() => {
		MockDate.set(new Date())
	})

	afterAll(() => {
		MockDate.reset()
	})

	test('Should call LoadSurveys ', async () => {
		const { sut, loadSurveysStub } = makeSut()
		const loadSpy = jest.spyOn(loadSurveysStub, 'load')

		await sut.handle({})

		expect(loadSpy).toHaveBeenCalled()
	})

	test('Should returns 200 on success', async () => {
		const { sut } = makeSut()

		const httpReponse = await sut.handle({})

		expect(httpReponse).toEqual(ok(makeFakeSurveys()))
	})
})
