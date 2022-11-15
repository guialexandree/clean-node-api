import { AccountModel } from '@/domain/models'
import { AddAccount } from '@/domain/usecases'
import faker from 'faker'

export const mockAddAccountParams = (): AddAccount.Params => ({
	name: faker.name.findName(),
	email: faker.internet.email(),
	password: faker.internet.password()
})

export const mockAccountModel = (): AccountModel =>
	Object.assign({}, mockAddAccountParams(), {
		id: faker.datatype.uuid()
	})

export const mockAuthenticationParams = (): any => {
	const { email, password } = mockAccountModel()

	return { email, password }
}
