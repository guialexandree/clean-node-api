import { Validation } from '@/presentation/protocols'
import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators'
import { makeSurveyValidation } from '@/main/factories/controllers'

jest.mock('@/validation/validators/validation-composite')

describe('SurveyValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSurveyValidation()
    const validations: Validation[] = []

    for (const field of ['answers', 'question']) {
      validations.push(new RequiredFieldValidation(field))
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
