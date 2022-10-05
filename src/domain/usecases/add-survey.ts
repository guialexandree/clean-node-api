type SurveyModel = {
	image: string,
	answer: string
}

export type AddSurveyModel = {
	question: string,
	answers: SurveyModel[]
}

export interface AddSurvey {
	add (data: AddSurveyModel) : Promise<void>
}
