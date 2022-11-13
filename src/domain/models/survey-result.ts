export type SurveyResultModel = {
  question: string
  surveyId: string
	answers: SurveyResultAnswerModel[]
	date: Date
}

type SurveyResultAnswerModel = {
	image?: string
	answer: string
	count: number
	percent: number
	isCurrentAccountAnswer: boolean
}
