interface AnswersModel {
  image: string
  answer: string
}

export interface SurveyModel {
  id: string
  question: string
  answers: AnswersModel[]
}
