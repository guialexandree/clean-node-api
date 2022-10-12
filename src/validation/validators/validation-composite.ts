import { Validation } from '@/presentation/protocols'

export class ValidationComposite implements Validation {
  constructor (private readonly validations: Validation[]) { }

  validate (input: any): Error {
    for (const validation of this.validations) {
      const erro = validation.validate(input)
      if (erro) {
        return erro
      }
    }

    return null as unknown as Error
  }
}
