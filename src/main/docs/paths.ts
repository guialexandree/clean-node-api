import {
	signUpPath,
	signInPath,
	surveyPath,
	surveyResultPath
} from './paths/'

export default {
	'/signin': signInPath,
	'/singup': signUpPath,
	'/surveys': surveyPath,
	'/surveys/{surveyId}/results': surveyResultPath
}
