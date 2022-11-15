import { CompareFieldsValidation } from '@/validation/validators'
import { InvalidParamError } from '@/presentation/errors'
import faker from 'faker'

const field = faker.random.word()
const fieldToCompare = faker.random.word()

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation(field, fieldToCompare)
}

describe('CompareFieldValidation', () => {
  test('Should return an InvalidParamError if validation fails', () => {
    const sut = makeSut()

    const erro = sut.validate({
      [field]: 'any_field',
      [fieldToCompare]: 'other_field'
    })

    expect(erro).toEqual(new InvalidParamError(fieldToCompare))
  })

  test('Should return null if validation on success', () => {
    const sut = makeSut()
		const value = faker.random.word()

    const erro = sut.validate({
      [field]: value,
      [fieldToCompare]: value
    })

    expect(erro).toBeNull()
  })
})
