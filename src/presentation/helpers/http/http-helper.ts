import { InternalServerError } from '@/presentation/errors'
import { UnauthorizedError } from '@/presentation/errors/unauthorized-error'
import { HttpResponse } from '@/presentation/protocols/http'

export const badRequest = (error: Error) : HttpResponse => ({
	statusCode: 400,
	body: error
})

export const forbidden = (error: Error) : HttpResponse => ({
	statusCode: 403,
	body: error
})

export const serverError = (error: Error) : HttpResponse => ({
	statusCode: 500,
	body: new InternalServerError(error.stack)
})

export const unauthorized = () : HttpResponse => ({
	statusCode: 401,
	body: new UnauthorizedError()
})

export const ok = (data: any) : HttpResponse => ({
	statusCode: 200,
	body: data
})
