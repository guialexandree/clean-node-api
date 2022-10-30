import { mockEmailValidator, mockValidation } from '@/validation/test'
import { EmailValidation } from './email-validation'
import { Validation, EmailValidator } from '@/presentation/protocols'
import { InvalidParamError } from '@/presentation/errors'

interface SutTypes {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = mockEmailValidator()
  const validationStub = mockValidation()
  const sut = new EmailValidation('email', emailValidatorStub)

  return {
    sut,
    emailValidatorStub,
    validationStub
  }
}

describe('SignUp Controller', () => {
  test('Should return an erro if EmailValidator returns false', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const erro = sut.validate({ email: 'guilherme@email.com' })

    expect(erro).toEqual(new InvalidParamError('email'))
  })

  test('Should call EmailValidator with corret email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    sut.validate({ email: 'guilherme@email.com' })

    expect(isValidSpy).toHaveBeenCalledWith('guilherme@email.com')
  })

  test('Should throw if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    expect(sut.validate).toThrow()
  })
})
