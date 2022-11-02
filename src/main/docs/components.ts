import {
	badRequest,
	unauthorized,
	serverError,
	notFound,
	forbidden
} from './components/'
import { apiKeyAuthSchema } from './schemas/api-key-auth-schema'

export default {
	securitySchemes: {
		apiKeyAuth: apiKeyAuthSchema
	},
	badRequest,
	unauthorized,
	serverError,
	notFound,
	forbidden
}
