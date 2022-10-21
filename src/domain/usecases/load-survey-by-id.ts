import { SurveyModel } from '../models/survey'

export interface LoadSurveyById {
  load: (id: string) => Promise<SurveyModel>
}
