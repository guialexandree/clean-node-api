type SurveyModel = {
	image: string,
	answer: string
}

export type AddSurveyModel = {
	question: string,
	answers: SurveyModel[]
}

export interface AddSurvey {
	add (dataSurvey: AddSurveyModel) : Promise<void>
}
