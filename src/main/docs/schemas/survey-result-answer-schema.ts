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
		},
		isCurrentAccountAnswer: {
			type: 'boolean'
		}
	},
	require: ['answer', 'count', 'percent', 'isCurrentAccountAnswer']
}
