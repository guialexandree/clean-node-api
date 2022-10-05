type AnswersModel = {
	image: string,
	answer: string
}

export type SurveyModel = {
	id: string,
	question: string,
	answers: AnswersModel[]
}
