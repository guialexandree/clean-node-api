import { adaptResolver } from '@/main/adapters'
import { makeSignInController, makeSignUpController } from '@/main/factories/controllers/'

export default {
	Query: {
		login: async (parent: any, args: any) => await adaptResolver(makeSignInController(), args)
	},

	Mutation: {
		signUp: async (parent: any, args: any) => await adaptResolver(makeSignUpController(), args)
	}
}
