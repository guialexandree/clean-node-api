import { SurveyModel } from '@/domain/models/survey'
import { LoadSurveys } from './load-surveys-controller-protocols'
import { LoadSurveysController } from './load-surveys.controller'
import MockDate from 'mockdate'

type SutTypes = {
	sut: LoadSurveysController
	loadSurveysStub: LoadSurveys
}

const makeLoadSurveys = (): LoadSurveys => {
	class LoadSurveysStub implements LoadSurveys {
		async load (): Promise<SurveyModel[]> {
			return await new Promise(resolve => resolve([]))
		}
	}

	return new LoadSurveysStub()
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
})
