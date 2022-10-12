import { DbAddSurvey, AddSurveyModel, AddSurveyRepository } from './db-add-survey-protocols'

const makeFakeAddSurvey = (): AddSurveyModel => {
  return {
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }
    ]
  }
}

const makeDbAddSurveyRepository = (): AddSurveyRepository => {
  class DbAddSurveyRepositoryStub implements AddSurveyRepository {
    async add (dataSurvey: AddSurveyModel): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }
  return new DbAddSurveyRepositoryStub()
}

interface SutTypes {
  sut: DbAddSurvey
  dbAddSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const dbAddSurveyRepositoryStub = makeDbAddSurveyRepository()
  const sut = new DbAddSurvey(dbAddSurveyRepositoryStub)

  return {
    sut,
    dbAddSurveyRepositoryStub
  }
}

describe('DbAddSurvey Usecase', () => {
  test('Should call DbAddSurveyRepository with correct values', async () => {
    const { sut, dbAddSurveyRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(dbAddSurveyRepositoryStub, 'add')

    await sut.add(makeFakeAddSurvey())

    expect(loadSpy).toHaveBeenCalledWith(makeFakeAddSurvey())
  })

  test('Should returns throws if DbAddSurveyRepository throws', async () => {
    const { sut, dbAddSurveyRepositoryStub } = makeSut()
    jest
      .spyOn(dbAddSurveyRepositoryStub, 'add')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const promise = sut.add(makeFakeAddSurvey())

    void expect(promise).rejects.toThrow(new Error())
  })
})
