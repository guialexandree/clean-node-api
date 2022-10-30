import { AccountModel } from '../models/account'
import { AddAccountParams } from '../usecases/account/add-account'

export const mockAddAccountParams = (): AddAccountParams => ({
	name: 'any_name',
	email: 'any_email@email.com',
	password: 'any_password'
})

export const mockAccountModel = (): AccountModel =>
	Object.assign({}, mockAddAccountParams(), {
		id: 'any_id'
	})

export const mockAuthentication = (): any => {
	const { email, password } = mockAccountModel()

	return { email, password }
}
