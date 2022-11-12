
import { Validation, Authentication, Controller, HttpRequest, HttpResponse } from './signin-controller-protocols'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http/http-helper'

export class SignInController implements Controller {
  constructor (
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const erro = this.validation.validate(httpRequest.body)
      if (erro) {
        return badRequest(erro)
      }

      const { email, password } = httpRequest.body

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
