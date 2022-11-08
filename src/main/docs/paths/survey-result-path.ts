export const surveyResultPath = {
	put: {
		tags: ['Enquetes'],
		summary: 'API para registrar a resposta para uma enquete',
		descripton: 'Essa rota só pode ser executado por usuário authenticados',
		security: [{
			apiKeyAuth: []
		}],
		parameters: [{
			in: 'path',
			name: 'surveyId',
			required: true,
			schema: {
				type: 'string'
			}
		}],
		requestBody: {
			content: {
				'application/json': {
					schema: {
						$ref: '#/schemas/saveSurveyParams'
					}
				}
			}
		},
		responses: {
			200: {
				description: 'Sucesso',
				content: {
					'application/json': {
						schema: {
							$ref: '#/schemas/surveyResult'
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
	get: {
		tags: ['Enquetes'],
		summary: 'API para consultar o resultado de uma enquete',
		descripton: 'Essa rota só pode ser executado por usuário authenticados',
		security: [{
			apiKeyAuth: []
		}],
		parameters: [{
			in: 'path',
			name: 'surveyId',
			required: true,
			schema: {
				type: 'string'
			}
		}],
		responses: {
			200: {
				description: 'Sucesso',
				content: {
					'application/json': {
						schema: {
							$ref: '#/schemas/surveyResult'
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
	}
}
