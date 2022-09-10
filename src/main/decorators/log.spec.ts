
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

interface SutTypes {
	sut: LogControllerDecorator,
	controller: Controller
}

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

const makeSut = () : SutTypes => {
	const controller = makeController()
	const sut = new LogControllerDecorator(controller)

	return {
		sut,
		controller
	}
}

describe('LogController Decorator', () => {
	test('Should call controller handle', async () => {
		const { sut, controller } = makeSut()

		const handleSpy = jest.spyOn(controller, 'handle')
		const httpRequest = {
			body: {
				name: 'Guilherme Alexandre',
				email: 'guilherme_alexandre@hotmail.com',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}
		await sut.handle(httpRequest)

		expect(handleSpy).toHaveBeenCalledWith(httpRequest)
	})

	test('Should return the same result of the controller', async () => {
		const { sut } = makeSut()
		const httpRequest = {
			body: {
				name: 'Guilherme Alexandre',
				email: 'guilherme_alexandre@hotmail.com',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}

		const response = await sut.handle(httpRequest)

		expect(response).toEqual({
			statusCode: 200,
			body: {
				name: 'Guilherme Alexandre'
			}
		})
	})
})
