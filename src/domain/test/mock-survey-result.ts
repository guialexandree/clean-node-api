import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => {
  return {
    accountId: 'any_account_id',
		surveyId: 'any_survey_id',
		answer: 'any_answer',
		date: new Date()
  }
}

export const mockSurveyResultModel = (): SurveyResultModel => ({
	surveyId: 'any_survey_id',
	question: 'any_question',
	answers: [{
		answer: 'any_answer',
		count: 8,
		percent: 80
	}, {
		answer: 'other_answer',
		image: 'any_image',
		count: 2,
		percent: 20
	}],
	date: new Date()
})
