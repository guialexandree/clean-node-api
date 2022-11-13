import { Authentication } from '@/domain/usecases'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers'
import { Controller, HttpResponse, Validation } from '@/presentation/protocols'

export class SignInController implements Controller {
  constructor (
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) { }

  async handle (request: SignInController.Request): Promise<HttpResponse> {
    try {
      const erro = this.validation.validate(request)
      if (erro) {
        return badRequest(erro)
      }

      const { email, password } = request

      const authenticationModel = await this.authentication.auth({ email, password })
      if (!authenticationModel) {
        return unauthorized()
      }

      return ok(authenticationModel)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace SignInController {
	export type Request = {
		email: string
		password: string
	}
}
