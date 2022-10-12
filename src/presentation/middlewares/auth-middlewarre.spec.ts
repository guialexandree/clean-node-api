import { LoadByAccountByToken } from '@/domain/usecases/load-account-by-token'
import { AccountModel, HttpRequest } from '../controllers/login/signup/signup-controller-protocols'
import { AccessDeniedError } from '../errors/access-denied-error'
import { forbidden } from '../helpers/http/http-helper'
import { AuthMiddleware } from './auth-middlewarre'

const makeLoadAccountByToken = () : LoadByAccountByToken => {
	class LoadByAccountByTokenStub implements LoadByAccountByToken {
		async load (accessToken: string) : Promise<AccountModel> {
			return new Promise(resolve => resolve(makeFakeAccount()))
		}
	}

	return new LoadByAccountByTokenStub()
}

const makeFakeAccount = () : AccountModel => ({
	id: 'any_id',
	name: 'guilherme',
	email: 'guilherme99@email.com',
	password: 'hashed_password'
})

const makeFakeRequest = () : HttpRequest => {
	return {
		headers: {
			'x-access-token': 'any_token'
		}
	}
}

type SutTypes = {
	sut: AuthMiddleware,
	loadAccountByTokenStub: LoadByAccountByToken
}

const makeSut = () : SutTypes => {
	const loadAccountByTokenStub = makeLoadAccountByToken()
	const sut = new AuthMiddleware(loadAccountByTokenStub)

	return {
		sut,
		loadAccountByTokenStub
	}
}

describe('Auth Middleware', () => {
	test('Should return 403 if no x-access-token exist in header', async () => {
		const { sut } = makeSut()

		const response = await sut.handle({})

		expect(response).toEqual(forbidden(new AccessDeniedError()))
	})

	test('Should call LoadAccountByToken with correct accessToken', async () => {
		const { sut, loadAccountByTokenStub } = makeSut()
		const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')

		await sut.handle(makeFakeRequest())

		expect(loadSpy).toHaveBeenCalledWith('any_token')
	})
})
