import { SignUpController } from './signup'
import { EmailValidator, AddAccount, AddAccountModel, AccountModel, Validation } from './signup-protocols'
import { MissingParamError, InvalidParamError, InternalServerError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helper'

const makeEmailValidator = () : EmailValidator => {
	class EmailValidatorStub implements EmailValidator {
		isValid (email: string) : boolean {
			return true
		}
	}

	return new EmailValidatorStub()
}

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
	emailValidatorStub: EmailValidator,
	addAccountStub: AddAccount,
	validationStub: Validation
}

const makeSut = () : SutTypes => {
	const emailValidatorStub = makeEmailValidator()
	const addAccountStub = makeAddAccountValidator()
	const validationStub = makeValidation()
	const sut = new SignUpController(emailValidatorStub, addAccountStub, validationStub)

	return {
		sut,
		emailValidatorStub,
		addAccountStub,
		validationStub
	}
}

describe('SignUp Controller', () => {
	test('Should return status 400 if no name is provided', async () => {
		const { sut } = makeSut()
		const httpRequest = {
			body: {
				email: 'email@email.com',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}

		const httpResponse = await sut.handle(httpRequest)

		expect(httpResponse)
			.toEqual(badRequest(new MissingParamError('name')))
	})

	test('Should return status 400 if no email is provided', async () => {
		const { sut } = makeSut()
		const httpRequest = {
			body: {
				name: 'any_name',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}

		const httpResponse = await sut.handle(httpRequest)

		expect(httpResponse)
			.toEqual(badRequest(new MissingParamError('email')))
	})

	test('Should return status 400 if no password is provided', async () => {
		const { sut } = makeSut()
		const httpRequest = {
			body: {
				email: 'email@email.com',
				name: 'any_name',
				passwordConfirmation: 'any_password'
			}
		}

		const httpResponse = await sut.handle(httpRequest)

		expect(httpResponse)
			.toEqual(badRequest(new MissingParamError('password')))
	})

	test('Should return status 400 if no passwordConfirmation is provided', async () => {
		const { sut } = makeSut()
		const httpRequest = {
			body: {
				email: 'email@email.com',
				name: 'any_name',
				password: 'any_password'
			}
		}

		const httpResponse = await sut.handle(httpRequest)

		expect(httpResponse)
			.toEqual(badRequest(new MissingParamError('passwordConfirmation')))
	})

	test('Should return status 400 if no password confirmation fails', async () => {
		const { sut } = makeSut()
		const httpRequest = {
			body: {
				email: 'email@email.com',
				name: 'any_name',
				password: 'any_password',
				passwordConfirmation: 'invalid_confirmation'
			}
		}

		const httpResponse = await sut.handle(httpRequest)

		expect(httpResponse)
			.toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
	})

	test('Should return status 400 if an invalid email is provided', async () => {
		const { sut, emailValidatorStub } = makeSut()
		const fakeRequest = makeFakeRequest()

		jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
		const httpResponse = await sut.handle(fakeRequest)

		expect(httpResponse)
			.toEqual(badRequest(new InvalidParamError('email')))
	})

	test('Should call EmailValidator with corret email', async () => {
		const { sut, emailValidatorStub } = makeSut()
		const fakeRequest = makeFakeRequest()

		const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
		await sut.handle(fakeRequest)

		expect(isValidSpy).toHaveBeenCalledWith('email@email.com')
	})

	test('Should return status 500 if EmailValidator throws', async () => {
		const { sut, emailValidatorStub } = makeSut()
		const fakeRequest = makeFakeRequest()

		jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
			throw new Error()
		})
		const httpResponse = await sut.handle(fakeRequest)

		expect(httpResponse)
			.toEqual(serverError(new InternalServerError(httpResponse.body)))
	})

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
