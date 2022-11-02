export const surveyResultSchema = {
	type: 'object',
	properties: {
		id: {
			type: 'string'
		},
		surveyId: {
			type: 'string'
		},
		accoundId: {
			type: 'string'
		},
		answer: {
			type: 'string'
		},
		date: {
			type: 'string'
		}
	}
}
