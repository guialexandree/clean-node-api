import { InvalidParamError } from '@/presentation/errors'
import { type Validation } from '@/presentation/protocols'
import { type EmailValidator } from '@/validation/protocols'

export class EmailValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) { }

  validate (input: any): Error {
    const isValidEmail = this.emailValidator.isValid(input[this.fieldName])
    if (!isValidEmail) {
      return new InvalidParamError(this.fieldName)
    }

    return null as unknown as Error
  }
}
