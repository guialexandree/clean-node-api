import {
	surveysSchema,
	signInParamsSchema,
	accountSchema,
	errorSchema,
	surveyResultSchema,
	surveySchema,
	surveyAnswerSchema,
	signUpParamsSchema,
	addSurveyParamsSchema,
	saveSurveyParamsSchema,
	surveyResultAnswerSchema
} from './schemas/'

export default {
	account: accountSchema,
	signInParams: signInParamsSchema,
	error: errorSchema,
	survey: surveySchema,
	surveys: surveysSchema,
	surveyAnswer: surveyAnswerSchema,
	signUpParams: signUpParamsSchema,
	addSurveyParams: addSurveyParamsSchema,
	saveSurveyParams: saveSurveyParamsSchema,
	surveyResult: surveyResultSchema,
	surveyResultAnswer: surveyResultAnswerSchema
}
