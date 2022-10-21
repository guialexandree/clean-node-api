import { SurveyModel } from '@/domain/models/survey'
import { SurveyResultModel } from '../models/survey-result'

export type SaveSurveyResultModel = Omit<SurveyModel, 'id'>

export interface SaveSurveyResult {
  save: (data: SaveSurveyResultModel) => Promise<SurveyResultModel>
}
