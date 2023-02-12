import { type SurveyModel } from '@/domain/models/survey'

export interface LoadSurveyByIdRepository {
  loadById: (id: string) => Promise<SurveyModel>
}

export namespace LoadSurveyByIdRepository {
	export type Result = SurveyModel
}
