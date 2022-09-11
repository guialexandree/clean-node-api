
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'
import { serverError } from '../../presentation/helpers/http-helper'
import { LogErrorRepository } from '../../data/protocols/log-error-repository'

const makeController = () => {
	class ControllerStub implements Controller {
		async handle (httpRequest: HttpRequest) : Promise<HttpResponse> {
			const httpResponse = {
				statusCode: 200,
				body: {
					name: 'Guilherme Alexandre'
				}
			}
			return new Promise(resolve => resolve(httpResponse))
		}
	}

	return new ControllerStub()
}

const makeErrorRepository = () => {
	class LogErrorRepositoryStub implements LogErrorRepository {
		async log (stack: string) : Promise<void> {
			return new Promise(resolve => resolve(console.log('deu certo bb')))
		}
	}

	return new LogErrorRepositoryStub()
}

interface SutTypes {
	sut: LogControllerDecorator
	controller: Controller
	httpRequest: HttpRequest
	logErrorRepository: LogErrorRepository
}

const makeSut = () : SutTypes => {
	const controller = makeController()
	const logErrorRepository = makeErrorRepository()
	const sut = new LogControllerDecorator(controller, logErrorRepository)
	const httpRequest = {
		body: {
			name: 'Guilherme Alexandre',
			email: 'guilherme_alexandre@hotmail.com',
			password: 'any_password',
			passwordConfirmation: 'any_password'
		}
	}

	return {
		sut,
		controller,
		httpRequest,
		logErrorRepository
	}
}

describe('LogController Decorator', () => {
	test('Should call controller handle', async () => {
		const { sut, controller, httpRequest } = makeSut()
		const handleSpy = jest.spyOn(controller, 'handle')

		await sut.handle(httpRequest)

		expect(handleSpy).toHaveBeenCalledWith(httpRequest)
	})

	test('Should return the same result of the controller', async () => {
		const { sut, httpRequest } = makeSut()

		const response = await sut.handle(httpRequest)

		expect(response).toEqual({
			statusCode: 200,
			body: {
				name: 'Guilherme Alexandre'
			}
		})
	})

	test('Should call LogErrorRepository if controller return a server error', async () => {
		const { sut, httpRequest, controller, logErrorRepository } = makeSut()
		const fakeError = new Error()
		const logSpy = jest.spyOn(logErrorRepository, 'log')
		jest
			.spyOn(controller, 'handle')
			.mockReturnValueOnce(new Promise(resolve => resolve(serverError(fakeError))))

			await sut.handle(httpRequest)

		expect(logSpy).toHaveBeenCalled()
	})
})
