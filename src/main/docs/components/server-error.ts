export const serverError = {
	description: 'Erro interno do Servidor',
	content: {
		'application/json': {
			schema: {
				$ref: '#/schemas/error'
			}
		}
	}
}
