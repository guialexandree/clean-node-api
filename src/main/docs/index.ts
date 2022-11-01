import { signUpPath, signInPath, surveyPath } from './paths'
import { surveysSchema, signInParamsSchema, accountSchema, errorSchema, surveySchema, surveyAnswerSchema, apiKeyAuthSchema, signUpParamsSchema, addSurveyParamsSchema } from './schemas'
import { badRequest, unauthorized, serverError, notFound, forbidden } from './components'

export default {
	openapi: '3.0.0',
	info: {
		title: 'API do curso do Rodrigo Manguinho para realização de enquetes',
		description: '',
		version: '1.0.0'
	},
	contact: {
		name: 'Guilherme Alexandre Rocha Pereira',
		email: 'guilherme_alexandree@hotmail.com'
	},
	license: {
		name: 'GPL-3.0-or-later',
		url: 'https://spdx.org/licenses/GPL-3.0-or-later.html'
	},
	servers: [{
		url: '/api'
	}],
	tags: [{
		name: 'Login'
	}, {
		name: 'Enquetes'
	}],
	paths: {
		'/signin': signInPath,
		'/surveys': surveyPath,
		'/singup': signUpPath
	},
	schemas: {
		account: accountSchema,
		signInParams: signInParamsSchema,
		error: errorSchema,
		survey: surveySchema,
		surveys: surveysSchema,
		surveyAnswer: surveyAnswerSchema,
		signUpParams: signUpParamsSchema,
		addSurveyParams: addSurveyParamsSchema
	},
	components: {
		securitySchemes: {
			apiKeyAuth: apiKeyAuthSchema
		},
		badRequest,
		unauthorized,
		serverError,
		notFound,
		forbidden
	}
}
