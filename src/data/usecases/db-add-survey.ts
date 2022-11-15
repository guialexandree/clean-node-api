import { AddSurvey } from '@/domain/usecases'
import { AddSurveyRepository } from '@/data/protocols'

export class DbAddSurvey implements AddSurvey {
  constructor (
    private readonly dbAddSurveyRepository: AddSurveyRepository
  ) {}

  async add (dataSurvey: AddSurvey.Params): Promise<void> {
    await this.dbAddSurveyRepository.add(dataSurvey)
  }
}
