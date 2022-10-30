import { AddSurveyController } from './add-survey-controller'
import { Validation, AddSurvey, HttpRequest } from './add-survey-controller-protocols'
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper'
import MockDate from 'mockdate'
import { throwError } from '@/domain/test'
import { mockAddSurvey, mockValidation } from '@/presentation/test'

const mockRequest = (): HttpRequest => {
  return {
    body: {
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer'
        }
      ],
			date: new Date()
    }
  }
}

interface SutTypes {
  sut: AddSurveyController
  validationStub: Validation
  addSurveyStub: AddSurvey
}

const makeSut = (): SutTypes => {
  const validationStub = mockValidation()
  const addSurveyStub = mockAddSurvey()
  const sut = new AddSurveyController(validationStub, addSurveyStub)
  return {
    sut,
    validationStub,
    addSurveyStub
  }
}

describe('AddSurvey Controller', () => {
	beforeAll(() => {
		MockDate.set(new Date())
	})

	afterAll(() => {
		MockDate.reset()
	})

  test('Should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const fakeRequest = mockRequest()

    await sut.handle(fakeRequest)

    expect(validateSpy).toHaveBeenCalledWith(fakeRequest.body)
  })

  test('Should returns status 400 if validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new Error())

    const response = await sut.handle(mockRequest())

    expect(response).toEqual(badRequest(new Error()))
  })

  test('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()
    const validateSpy = jest.spyOn(addSurveyStub, 'add')
    const fakeRequest = mockRequest()

    await sut.handle(fakeRequest)

    expect(validateSpy).toHaveBeenCalledWith(fakeRequest.body)
  })

  test('Should returns serverError if AddSurvey throws', async () => {
    const { sut, addSurveyStub } = makeSut()
    jest
      .spyOn(addSurveyStub, 'add')
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
