import { adaptResolver } from '@/main/adapters'
import { makeSignInController } from '@/main/factories/controllers/'

export default {
	Query: {
		login: async (parent: any, args: any) => await adaptResolver(makeSignInController(), args)
	}
}
