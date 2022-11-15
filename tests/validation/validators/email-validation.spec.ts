import { EmailValidation } from '@/validation/validators'
import { InvalidParamError } from '@/presentation/errors'
import { EmailValidatorSpy, ValidationSpy } from '@/tests/validation/mocks'
import { throwError } from '@/tests/domain/mocks'
import faker from 'faker'

const field = faker.random.word()

interface SutTypes {
  sut: EmailValidation
  emailValidatorSpy: EmailValidatorSpy
  validationSpy: ValidationSpy
}

const makeSut = (): SutTypes => {
  const emailValidatorSpy = new EmailValidatorSpy()
  const validationSpy = new ValidationSpy()
  const sut = new EmailValidation(field, emailValidatorSpy)

  return {
    sut,
    emailValidatorSpy,
    validationSpy
  }
}

describe('SignUp Controller', () => {
  test('Should return an erro if EmailValidator returns false', () => {
    const { sut, emailValidatorSpy } = makeSut()
    emailValidatorSpy.isEmailValid = false
    const email = faker.internet.email()

    const error = sut.validate({ [field]: email })

    expect(error).toEqual(new InvalidParamError(field))
  })

  test('Should call EmailValidator with corret email', () => {
    const { sut, emailValidatorSpy } = makeSut()
    const email = faker.internet.email()

    sut.validate({ [field]: email })

    expect(emailValidatorSpy.email).toBe(email)
  })

  test('Should throw if EmailValidator throws', () => {
    const { sut, emailValidatorSpy } = makeSut()
    jest
			.spyOn(emailValidatorSpy, 'isValid')
			.mockImplementationOnce(throwError)

    expect(sut.validate).toThrow()
  })
})
