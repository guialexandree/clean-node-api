import { type NextFunction, type Request, type Response } from 'express'
import { type Middleware } from '@/presentation/protocols'

export const adaptMiddleware = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest = {
			accessToken: req.headers?.['x-access-token'],
      ...(req.headers || {})
    }
    const httpResponse = await middleware.handle(httpRequest)

    if (httpResponse.statusCode === 200) {
			Object.assign(req, httpResponse.body)
      next()
    } else {
      res
        .status(httpResponse.statusCode)
        .json({
          error: httpResponse.body.message
        })
    }
  }
}
