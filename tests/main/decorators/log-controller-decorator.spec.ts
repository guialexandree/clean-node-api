import { Controller, HttpResponse } from '@/presentation/protocols'
import { ok, serverError } from '@/presentation/helpers'
import { LogControllerDecorator } from '@/main/decorators'
import { mockAccountModel } from '@/tests/domain/mocks'
import { LogErrorRepositorySpy } from '@/tests/data/mocks'
import faker from 'faker'

export class ControllerSpy implements Controller {
	httpResponse = ok(mockAccountModel())
  request: any

	async handle (request: any): Promise<HttpResponse> {
		this.request = request
    return await Promise.resolve(this.httpResponse)
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
    const request = faker.lorem.sentence()

    await sut.handle(request)

    expect(controllerSpy.request).toEqual(request)
  })

  test('Should return the same result of the controller', async () => {
    const { sut, controllerSpy } = makeSut()

    const response = await sut.handle(faker.lorem.sentence())

    expect(response).toEqual(controllerSpy.httpResponse)
  })

  test('Should call LogErrorRepository if controller return a server error', async () => {
    const { sut, controllerSpy, logErrorRepositorySpy } = makeSut()
    const serverError = mockServerError()
    controllerSpy.httpResponse = serverError

    await sut.handle(faker.lorem.sentence())

    expect(logErrorRepositorySpy.stack).toBe(serverError.body.stack)
  })
})
