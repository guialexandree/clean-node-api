import { AddSurvey, AddSurveyParams } from '@/domain/usecases'
import { AddSurveyRepository } from '@/data/protocols'

export class DbAddSurvey implements AddSurvey {
  constructor (
    private readonly dbAddSurveyRepository: AddSurveyRepository
  ) {}

  async add (dataSurvey: AddSurveyParams): Promise<void> {
    await this.dbAddSurveyRepository.add(dataSurvey)
  }
}
