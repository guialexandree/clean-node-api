import { AddSurveyController } from './add-survey-controller'
import { Validation } from './add-survey-controller-protocols'

const makeFakeRequest = () => {
	return {
		body: {
			question: 'any_question',
			answer: [
				{
					image: 'any_image',
					answer: 'any_answer'
				}
			]
		}
	}
}

const makeValidationStub = () : Validation => {
	class ValidationStub implements Validation {
		validate (input: any) : Error {
			return null as unknown as Error
		}
	}

	return new ValidationStub()
}

type SutTypes = {
	sut: AddSurveyController,
	validationStub: Validation
}

const makeSut = () : SutTypes => {
	const validationStub = makeValidationStub()
	const sut = new AddSurveyController(validationStub)

	return {
		sut,
		validationStub
	}
}

describe('AddSurvey Controller', () => {
	test('Should call validation with correct values', async () => {
		const { sut, validationStub } = makeSut()
		const validateSpy = jest.spyOn(validationStub, 'validate')
		const fakeRequest = makeFakeRequest()

		await sut.handle(fakeRequest)

		expect(validateSpy).toHaveBeenCalledWith(fakeRequest.body)
	})
})
