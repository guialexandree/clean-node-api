import paths from './paths'
import schemas from './schemas'
import components from './components'

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
	paths,
	schemas,
	components
}
