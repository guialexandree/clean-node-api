import { SignUpController } from './signup-controller'
import { AddAccount, AddAccountModel, AccountModel, Validation } from './signup-controller-protocols'
import { MissingParamError, InternalServerError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http/http-helper'

const makeValidation = () : Validation => {
	class ValidationStub implements Validation {
		validate (input: any) : Error {
			return null as unknown as Error
		}
	}

	return new ValidationStub()
}

const makeAddAccountValidator = () : AddAccount => {
	class AddAccountStub implements AddAccount {
		async add (account: AddAccountModel) : Promise<AccountModel> {
			return new Promise(resolve => resolve(makeFakeAccount()))
		}
	}

	return new AddAccountStub()
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
	name: 'valid_name',
	password: 'valid_password'
})

interface SutTypes {
	sut: SignUpController,
	addAccountStub: AddAccount,
	validationStub: Validation
}

const makeSut = () : SutTypes => {
	const addAccountStub = makeAddAccountValidator()
	const validationStub = makeValidation()
	const sut = new SignUpController(addAccountStub, validationStub)

	return {
		sut,
		addAccountStub,
		validationStub
	}
}

describe('SignUp Controller', () => {
	test('Should call AddAccount with correct values', async () => {
		const { sut, addAccountStub } = makeSut()
		const fakeRequest = makeFakeRequest()

		const addSpy = jest.spyOn(addAccountStub, 'add')
		await sut.handle(fakeRequest)

		expect(addSpy).toHaveBeenCalledWith({
			email: 'email@email.com',
			name: 'any_name',
			password: 'any_password'
		})
	})

	test('Should return status 500 if AddAccount throws', async () => {
		const { sut, addAccountStub } = makeSut()
		const fakeRequest = makeFakeRequest()

		jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
			return new Promise((resolve, reject) => reject(new Error()))
		})
		const httpResponse = await sut.handle(fakeRequest)

		expect(httpResponse)
			.toEqual(serverError(new InternalServerError(httpResponse.body)))
	})

	test('Should return status 200 if data is provided', async () => {
		const { sut } = makeSut()
		const fakeRequest = makeFakeRequest()

		const httpResponse = await sut.handle(fakeRequest)

		expect(httpResponse)
			.toEqual(ok(makeFakeAccount()))
	})

	test('Should call Validation with correct value', async () => {
		const { sut, validationStub } = makeSut()
		const fakeRequest = makeFakeRequest()

		const validatoSpy = jest.spyOn(validationStub, 'validate')
		await sut.handle(fakeRequest)

		expect(validatoSpy).toHaveBeenCalledWith(fakeRequest.body)
	})

	test('Should return status 400 if Validation return error', async () => {
		const { sut, validationStub } = makeSut()
		const fakeRequest = makeFakeRequest()

		jest
			.spyOn(validationStub, 'validate')
			.mockReturnValueOnce(new MissingParamError('any_param'))

		const response = await sut.handle(fakeRequest)

		expect(response).toEqual(badRequest(new MissingParamError('any_param')))
	})
})
