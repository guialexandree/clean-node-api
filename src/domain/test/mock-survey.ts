import { SurveyModel } from '@/domain/models/survey'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'

export const mockSurveyModel = (): SurveyModel => {
	return {
		id: 'any_id',
		question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }, {
        answer: 'other_answer'
      }
    ],
		date: new Date()
	}
}

export const mockSurveysModel = (): SurveyModel[] => {
	return [{
		id: 'any_id',
		question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }, {
        answer: 'other_answer'
      }
    ],
		date: new Date()
	}, {
		id: 'other_id',
		question: 'other_question',
    answers: [
      {
        image: 'other_image',
        answer: 'other_answer'
      }, {
        answer: 'other_answer'
      }
    ],
		date: new Date()
	}]
}

export const mockFakeAddSurvey = (): AddSurveyParams => {
  return {
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }, {
				answer: 'any_answer2'
			}
    ],
		date: new Date()
  }
}
