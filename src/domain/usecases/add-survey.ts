import { type SurveyModel } from '@/domain/models'

export interface AddSurvey {
  add: (dataSurvey: AddSurvey.Params) => Promise<void>
}

export namespace AddSurvey {
	export type Params = Omit<SurveyModel, 'id'>
}
