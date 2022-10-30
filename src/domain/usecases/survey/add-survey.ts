import { SurveyAnswerModel } from '../../models/survey'

export interface AddSurveyParams {
  question: string
  answers: SurveyAnswerModel[]
	date: Date
}

export interface AddSurvey {
  add: (dataSurvey: AddSurveyParams) => Promise<void>
}
