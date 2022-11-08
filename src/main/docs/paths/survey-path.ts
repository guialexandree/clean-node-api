export const surveyPath = {
	get: {
		security: [{
			apiKeyAuth: []
		}],
		tags: ['Enquetes'],
		summary: 'API para listar todas as enquetes',
		descripton: 'Essa rota só pode ser executado por usuário authenticados',
		responses: {
			200: {
				description: 'Sucesso',
				content: {
					'application/json': {
						schema: {
							$ref: '#/schemas/surveys'
						}
					}
				}
			},
			403: {
				$ref: '#/components/forbidden'
			},
			404: {
				$ref: '#/components/notFound'
			},
			500: {
				$ref: '#/components/serverError'
			}
		}
	},
	post: {
		security: [{
			apiKeyAuth: []
		}],
		tags: ['Enquetes'],
		summary: 'API para criar uma enquete',
		descripton: 'Essa rota só pode ser executado por usuário authenticados',
		requestBody: {
			content: {
				'application/json': {
					schema: {
						$ref: '#/schemas/addSurveyParams'
					}
				}
			}
		},
		responses: {
			204: {
				description: 'Sucesso'
			},
			403: {
				$ref: '#/components/forbidden'
			},
			404: {
				$ref: '#/components/notFound'
			},
			500: {
				$ref: '#/components/serverError'
			}
		}
	}
}
