export const accountSchema = {
	type: 'object',
	properties: {
		accessToken: {
			type: 'string'
		},
		name: {
			type: 'string'
		}
	},
	require: ['accessToken', 'name']
}
