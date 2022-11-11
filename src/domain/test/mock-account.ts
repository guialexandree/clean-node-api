import { AccountModel } from '../models/account'
import { AddAccountParams } from '../usecases/account/add-account'
import faker from 'faker'

export const mockAddAccountParams = (): AddAccountParams => ({
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
