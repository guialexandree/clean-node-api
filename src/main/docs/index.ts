import { loginPath } from './paths'
import { signInParamsSchema, accountSchema, errorSchema } from './schemas'
import { badRequest, unauthorized, serverError, notFound } from './components'

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
	}],
	paths: {
		'/signin': loginPath
	},
	schemas: {
		account: accountSchema,
		signInParams: signInParamsSchema,
		error: errorSchema
	},
	components: {
		badRequest,
		unauthorized,
		serverError,
		notFound
	}
}
