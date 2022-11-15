import { LogMongoRepository } from '@/infra/db/mongodb'
import { Controller } from '@/presentation/protocols'
import { LogControllerDecorator } from '@/main/decorators'

export const makeControllerDecorator = (controller: Controller): Controller => {
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(controller, logMongoRepository)
}
