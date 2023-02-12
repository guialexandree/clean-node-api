import { type SurveyResultModel } from '@/domain/models'
import { type SaveSurveyResult } from '@/domain/usecases'
import faker from 'faker'

export const mockSaveSurveyResultParams = (): SaveSurveyResult.Params => {
  return {
    accountId: faker.datatype.uuid(),
		surveyId: faker.datatype.uuid(),
		answer: faker.random.word(),
		date: faker.date.recent()
  }
}

export const mockSurveyResultModel = (): SurveyResultModel => ({
	surveyId: faker.datatype.uuid(),
	question: faker.random.words(),
	answers: [{
		answer: faker.random.word(),
		image: faker.image.imageUrl(),
		count: faker.datatype.number({ min: 0, max: 1000 }),
		percent: faker.datatype.number({ min: 0, max: 100 }),
		isCurrentAccountAnswer: faker.datatype.boolean()
	}, {
		answer: faker.random.word(),
		image: faker.image.imageUrl(),
		count: faker.datatype.number({ min: 0, max: 1000 }),
		percent: faker.datatype.number({ min: 0, max: 100 }),
		isCurrentAccountAnswer: faker.datatype.boolean()
	}],
	date: faker.date.recent()
})
