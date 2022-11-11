import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ok, serverError } from '@/presentation/helpers/http/http-helper'
import { LogControllerDecorator } from './log-controller-decorator'
import { mockAccountModel } from '@/domain/test'
import { LogErrorRepositorySpy } from '@/data/test'
import faker from 'faker'

export class ControllerSpy implements Controller {
	httpResponse = ok(mockAccountModel())
  httpRequest: HttpRequest

	async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
		this.httpRequest = httpRequest
    return await Promise.resolve(this.httpResponse)
	}
}

const mockRequest = (): HttpRequest => {
  const password = faker.internet.password()
  return {
    body: {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password,
      passwordConfirmation: password
    }
  }
}

const mockServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}

interface SutTypes {
  sut: LogControllerDecorator
  controllerSpy: ControllerSpy
  logErrorRepositorySpy: LogErrorRepositorySpy
}

const makeSut = (): SutTypes => {
  const controller = new ControllerSpy()
  const logErrorRepository = new LogErrorRepositorySpy()
  const sut = new LogControllerDecorator(controller, logErrorRepository)

  return {
    sut,
    controllerSpy: controller,
    logErrorRepositorySpy: logErrorRepository
  }
}

describe('LogControllerDecorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerSpy } = makeSut()
    const httpRequest = mockRequest()

    await sut.handle(httpRequest)

    expect(controllerSpy.httpRequest).toEqual(httpRequest)
  })

  test('Should return the same result of the controller', async () => {
    const { sut, controllerSpy } = makeSut()

    const response = await sut.handle(mockRequest())

    expect(response).toEqual(controllerSpy.httpResponse)
  })

  test('Should call LogErrorRepository if controller return a server error', async () => {
    const { sut, controllerSpy, logErrorRepositorySpy } = makeSut()
    const serverError = mockServerError()
    controllerSpy.httpResponse = serverError

    await sut.handle(mockRequest())

    expect(logErrorRepositorySpy.stack).toBe(serverError.body.stack)
  })
})
