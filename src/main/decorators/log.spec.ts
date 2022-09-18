
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'
import { ok, serverError } from '../../presentation/helpers/http/http-helper'
import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { AccountModel } from '../../domain/models/account'

const makeController = () => {
	class ControllerStub implements Controller {
		async handle (httpRequest: HttpRequest) : Promise<HttpResponse> {
			return new Promise(resolve => resolve(ok(makeFakeAccount())))
		}
	}

	return new ControllerStub()
}

const makeErrorRepository = () => {
	class LogErrorRepositoryStub implements LogErrorRepository {
		async logError (stack: string) : Promise<void> {
			return new Promise(resolve => resolve())
		}
	}

	return new LogErrorRepositoryStub()
}

const makeFakeRequest = () => ({
	body: {
		email: 'email@email.com',
		name: 'any_name',
		password: 'any_password',
		passwordConfirmation: 'any_password'
	}
})

const makeFakeAccount = () : AccountModel => ({
	id: 'valid_id',
	email: 'email@email.com',
	name: 'any_name',
	password: 'any_password'
})

interface SutTypes {
	sut: LogControllerDecorator
	controller: Controller
	logErrorRepository: LogErrorRepository
}

const makeSut = () : SutTypes => {
	const controller = makeController()
	const logErrorRepository = makeErrorRepository()
	const sut = new LogControllerDecorator(controller, logErrorRepository)

	return {
		sut,
		controller,
		logErrorRepository
	}
}

describe('LogController Decorator', () => {
	test('Should call controller handle', async () => {
		const { sut, controller } = makeSut()
		const handleSpy = jest.spyOn(controller, 'handle')
		const fakeRequest = makeFakeRequest()
		await sut.handle(fakeRequest)

		expect(handleSpy).toHaveBeenCalledWith(fakeRequest)
	})

	test('Should return the same result of the controller', async () => {
		const { sut } = makeSut()
		const response = await sut.handle(makeFakeRequest())

		expect(response).toEqual(ok(makeFakeAccount()))
	})

	test('Should call LogErrorRepository if controller return a server error', async () => {
		const { sut, controller, logErrorRepository } = makeSut()
		const fakeError = new Error()
		fakeError.stack = 'any_stack'
		const logSpy = jest.spyOn(logErrorRepository, 'logError')
		jest
			.spyOn(controller, 'handle')
			.mockReturnValueOnce(new Promise(resolve => resolve(serverError(fakeError))))

		await sut.handle(makeFakeRequest())

		expect(logSpy).toHaveBeenCalled()
	})

	test('Should call LogErrorRepository with correct stack error', async () => {
		const { sut, controller, logErrorRepository } = makeSut()
		const fakeError = new Error()
		fakeError.stack = 'any_stack'
		const logSpy = jest.spyOn(logErrorRepository, 'logError')
		jest
			.spyOn(controller, 'handle')
			.mockReturnValueOnce(new Promise(resolve => resolve(serverError(fakeError))))

		await sut.handle(makeFakeRequest())

		expect(logSpy).toHaveBeenCalledWith('any_stack')
	})
})
