import { type AddAccount, type Authentication } from '@/domain/usecases'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers'
import { EmailInUseError } from '@/presentation/errors'
import { type Controller, type HttpResponse, type Validation } from '@/presentation/protocols'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle (request: SignUpController.Request): Promise<HttpResponse> {
    try {
      const erro = this.validation.validate(request)
      if (erro) {
        return badRequest(erro)
      }

      const { name, password, email } = request

      const isValid = await this.addAccount.add({
        name,
        email,
        password
      })

      if (!isValid) {
        return forbidden(new EmailInUseError())
      }

      const authenticationModel = await this.authentication.auth({
        email,
        password
      })

      return ok(authenticationModel)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace SignUpController {
	export type Request = {
		name: string
		email: string
		password: string
		passwordConfirmation: string
	}
}
