export const surveyResultAnswerSchema = {
	type: 'object',
	properties: {
		image: {
			type: 'string'
		},
		answer: {
			type: 'string'
		},
		count: {
			type: 'string'
		},
		percent: {
			type: 'string'
		}
	},
	require: ['answer', 'count', 'percent']
}
