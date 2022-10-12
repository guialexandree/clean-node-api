
import { AddSurvey, AddSurveyModel, AddSurveyRepository } from './db-add-survey-protocols'

export class DbAddSurvey implements AddSurvey {
  constructor (
    private readonly dbAddSurveyRepository: AddSurveyRepository
  ) {}

  async add (dataSurvey: AddSurveyModel): Promise<void> {
    await this.dbAddSurveyRepository.add(dataSurvey)
  }
}
