import { SurveyAnswerModel, SurveyModel } from '@/domain/models'
import { AddSurvey } from '@/domain/usecases'
import faker from 'faker'

const mockAnswers = (): SurveyAnswerModel[] => (
	[...Array(2)].map(_ => (
		{
			image: faker.image.imageUrl(),
			answer: faker.random.word()
		}
	))
)

export const mockSurveyModel = (): SurveyModel => {
	return {
		id: faker.datatype.uuid(),
		question: faker.random.words(),
    answers: mockAnswers(),
		date: new Date()
	}
}

export const mockSurveysModel = (): SurveyModel[] => {
	return [{
		id: faker.datatype.uuid(),
		question: faker.random.words(),
    answers: mockAnswers(),
		date: faker.date.recent()
	}, {
		id: faker.datatype.uuid(),
		question: faker.random.words(),
    answers: mockAnswers(),
		date: faker.date.recent()
	}]
}

export const mockAddSurveyParams = (): AddSurvey.Params => {
  return {
    question: faker.random.words(),
    answers: mockAnswers(),
		date: faker.date.recent()
  }
}
