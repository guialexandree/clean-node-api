import { SignUpController } from './signup'
import { EmailValidator, AddAccount, AddAccountModel, AccountModel } from './signup-protocols'
import { MissingParamError, InvalidParamError, InternalServerError } from '../../errors'

interface SutTypes {
	sut: SignUpController,
	emailValidatorStub: EmailValidator,
	addAccountStub: AddAccount
}

const makeEmailValidator = () : EmailValidator => {
	class EmailValidatorStub implements EmailValidator {
		isValid (email: string) : boolean {
			return true
		}
	}

	return new EmailValidatorStub()
}

const makeAddAccountValidator = () : AddAccount => {
	class AddAccountStub implements AddAccount {
		async add (account: AddAccountModel) : Promise<AccountModel> {
			const fakeAccount = {
				id: 'valid_id',
				email: 'email@email.com',
				name: 'valid_name',
				password: 'valid_password'
			}

			return new Promise(resolve => resolve(fakeAccount))
		}
	}

	return new AddAccountStub()
}

const makeSut = () : SutTypes => {
	const emailValidatorStub = makeEmailValidator()
	const addAccountStub = makeAddAccountValidator()
	const sut = new SignUpController(emailValidatorStub, addAccountStub)

	return {
		sut,
		emailValidatorStub,
		addAccountStub
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

		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamError('name'))
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

		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamError('email'))
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

		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamError('password'))
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

		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
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

		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
	})

	test('Should return status 400 if an invalid email is provided', async () => {
		const { sut, emailValidatorStub } = makeSut()
		const httpRequest = {
			body: {
				email: 'invalid@email.com',
				name: 'any_name',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}

		jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
		const httpResponse = await sut.handle(httpRequest)

		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new InvalidParamError('email'))
	})

	test('Should call EmailValidator with corret email', async () => {
		const { sut, emailValidatorStub } = makeSut()
		const httpRequest = {
			body: {
				email: 'email@email.com',
				name: 'any_name',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}

		const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
		await sut.handle(httpRequest)

		expect(isValidSpy).toHaveBeenCalledWith('email@email.com')
	})

	test('Should return status 500 if EmailValidator throws', async () => {
		const { sut, emailValidatorStub } = makeSut()
		const httpRequest = {
			body: {
				email: 'invalid@email.com',
				name: 'any_name',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}

		jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
			throw new Error()
		})
		const httpResponse = await sut.handle(httpRequest)

		expect(httpResponse.statusCode).toBe(500)
		expect(httpResponse.body).toEqual(new InternalServerError(httpResponse.body))
	})

	test('Should call AddAccount with correct values', async () => {
		const { sut, addAccountStub } = makeSut()
		const httpRequest = {
			body: {
				email: 'email@email.com',
				name: 'any_name',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}

		const addSpy = jest.spyOn(addAccountStub, 'add')
		await sut.handle(httpRequest)

		expect(addSpy).toHaveBeenCalledWith({
			email: 'email@email.com',
			name: 'any_name',
			password: 'any_password'
		})
	})

	test('Should return status 500 if AddAccount throws', async () => {
		const { sut, addAccountStub } = makeSut()
		const httpRequest = {
			body: {
				email: 'invalid@email.com',
				name: 'any_name',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}

		jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
			return new Promise((resolve, reject) => reject(new Error()))
		})
		const httpResponse = await sut.handle(httpRequest)

		expect(httpResponse.statusCode).toBe(500)
		expect(httpResponse.body).toEqual(new InternalServerError(httpResponse.body))
	})

	test('Should return status 200 if data is provided', async () => {
		const { sut } = makeSut()
		const httpRequest = {
			body: {
				name: 'valid_name',
				email: 'email@email.com',
				password: 'valid_password',
				passwordConfirmation: 'valid_password'
			}
		}

		const httpResponse = await sut.handle(httpRequest)

		expect(httpResponse.statusCode).toBe(200)
		expect(httpResponse.body).toEqual({
			id: 'valid_id',
			name: 'valid_name',
			email: 'email@email.com',
			password: 'valid_password'
		})
	})
})
