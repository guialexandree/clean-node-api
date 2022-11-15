import { AddSurveyController } from '@/presentation/controllers'
import { badRequest, noContent, serverError } from '@/presentation/helpers'
import { AddSurveySpy, ValidationSpy } from '@/tests/presentation/mocks'
import { throwError } from '@/tests/domain/mocks'
import MockDate from 'mockdate'
import faker from 'faker'

const mockRequest = (): AddSurveyController.Request => {
  return {
    question: faker.random.words(),
		answers: [
			{
				image: faker.image.imageUrl(),
				answer: faker.random.word()
			}
		]
  }
}

interface SutTypes {
  sut: AddSurveyController
  validationSpy: ValidationSpy
  addSurveySpy: AddSurveySpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const addSurveySpy = new AddSurveySpy()
  const sut = new AddSurveyController(validationSpy, addSurveySpy)

	return {
    sut,
    validationSpy,
    addSurveySpy
  }
}

describe('AddSurveyController', () => {
	beforeAll(() => {
		MockDate.set(new Date())
	})

	afterAll(() => {
		MockDate.reset()
	})

  test('Should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut()
    const request = mockRequest()

    await sut.handle(request)

    expect(validationSpy.input).toEqual(request)
  })

  test('Should returns status 400 if validation fails', async () => {
    const { sut, validationSpy } = makeSut()
    validationSpy.error = new Error()

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(badRequest(validationSpy.error))
  })

  test('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveySpy } = makeSut()
    const request = mockRequest()

    await sut.handle(request)

    expect(addSurveySpy.addSurveyParams).toEqual({ ...request, date: new Date() })
  })

  test('Should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveySpy } = makeSut()
    jest
      .spyOn(addSurveySpy, 'add')
      .mockImplementationOnce(throwError)

    const response = await sut.handle(mockRequest())

    expect(response).toEqual(serverError(new Error()))
  })

  test('Should returns noContent on success', async () => {
    const { sut } = makeSut()

    const response = await sut.handle(mockRequest())

    expect(response).toEqual(noContent())
  })
})
