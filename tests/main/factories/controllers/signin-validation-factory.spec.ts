import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'
import { type Validation } from '@/presentation/protocols'
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '@/validation/validators'
import { makeSignInValidation } from '@/main/factories/controllers'

jest.mock('@/validation/validators/validation-composite')

describe('SignInValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignInValidation()
    const validations: Validation[] = []

    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
