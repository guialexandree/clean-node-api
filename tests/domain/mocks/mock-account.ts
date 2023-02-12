import { type AddAccount, type Authentication } from '@/domain/usecases'
import faker from 'faker'

export const mockAddAccountParams = (): AddAccount.Params => ({
	name: faker.name.findName(),
	email: faker.internet.email(),
	password: faker.internet.password()
})

export const mockAuthenticationParams = (): Authentication.Params => {
	return {
		email: faker.internet.email(),
		password: faker.internet.password()
	}
}
