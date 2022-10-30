import { mockValidation } from '@/validation/test'
import { ValidationComposite } from './validation-composite'
import { Validation } from '@/presentation/protocols'
import { InvalidParamError, MissingParamError } from '@/presentation/errors'

interface SutTypes {
  sut: ValidationComposite
  validationStubs: Validation[]
}

const makeSut = (): SutTypes => {
  const validationStubs: Validation[] = [
    mockValidation(),
    mockValidation()
  ]
  const sut = new ValidationComposite(validationStubs)

  return {
    sut,
    validationStubs
  }
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()

    jest
      .spyOn(validationStubs[1], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'))
    const erro = sut.validate({ field: 'any_value' })

    expect(erro).toEqual(new MissingParamError('field'))
  })

  test('Should return the first error if more then one validation fails', () => {
    const { sut, validationStubs } = makeSut()

    jest
      .spyOn(validationStubs[0], 'validate')
      .mockReturnValueOnce(new InvalidParamError('field'))
    jest
      .spyOn(validationStubs[1], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'))

    const erro = sut.validate({ field: 'any_value' })

    expect(erro).toEqual(new InvalidParamError('field'))
  })

  test('Should return null if all validations on success', () => {
    const { sut } = makeSut()

    const erro = sut.validate({ field: 'any_value' })

    expect(erro).toBeNull()
  })
})
