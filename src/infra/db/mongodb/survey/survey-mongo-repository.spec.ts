import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helpers'
import { AddSurveyModel } from './survey-mongo-protocols'
import { SurveyMongoRepository } from './survey-mongo-repository'

let surveyCollection: Collection

const makeSurveyData = (): AddSurveyModel => {
  return {
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }, {
        answer: 'other_answer'
      }
    ]
  }
}

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  test('Should add a survey on  success', async () => {
    const sut = makeSut()
    await sut.add(makeSurveyData())

    const survey = await surveyCollection.findOne({ question: 'any_question' })
    expect(survey).toBeTruthy()
  })
})
