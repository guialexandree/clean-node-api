import {
	signUpPath,
	signInPath,
	surveyPath,
	surveyResultPath
} from './paths/'

export default {
	'/signin': signInPath,
	'/signup': signUpPath,
	'/survey': surveyPath,
	'/surveys/{surveyId}/results': surveyResultPath
}
