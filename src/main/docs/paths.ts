import {
	signUpPath,
	signInPath,
	surveyPath,
	surveyResultPath
} from './paths/'

export default {
	'/signin': signInPath,
	'/signup': signUpPath,
	'/surveys': surveyPath,
	'/surveys/{surveyId}/results': surveyResultPath
}
