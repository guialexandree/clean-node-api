import { type Validation } from '@/presentation/protocols'
import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'
import { EmailValidation, ValidationComposite, CompareFieldsValidation, RequiredFieldValidation } from '@/validation/validators'
import { makeSignUpValidation } from '@/main/factories/controllers'

jest.mock('@/validation/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
