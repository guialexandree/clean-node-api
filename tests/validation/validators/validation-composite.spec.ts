import { ValidationComposite } from '@/validation/validators'
import { MissingParamError } from '@/presentation/errors'
import { ValidationSpy } from '@/tests/validation/mocks'
import faker from 'faker'

const field = faker.random.word()

interface SutTypes {
  sut: ValidationComposite
  validationSpies: ValidationSpy[]
}

const makeSut = (): SutTypes => {
  const validationSpies: ValidationSpy[] = [
    new ValidationSpy(),
    new ValidationSpy()
  ]
  const sut = new ValidationComposite(validationSpies)

  return {
    sut,
    validationSpies
  }
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationSpies } = makeSut()
    validationSpies[1].error = new MissingParamError(field)
    const error = sut.validate({ [field]: faker.random.word() })
    expect(error).toEqual(validationSpies[1].error)
  })

  test('Should return the first error if more then one validation fails', () => {
    const { sut, validationSpies } = makeSut()
    validationSpies[0].error = new Error()
    validationSpies[1].error = new MissingParamError(field)

    const error = sut.validate({ [field]: faker.random.word() })

    expect(error).toEqual(validationSpies[0].error)
  })

  test('Should return null if all validations on success', () => {
    const { sut } = makeSut()

    const error = sut.validate({ [field]: faker.random.word() })

    expect(error).toBeFalsy()
  })
})
