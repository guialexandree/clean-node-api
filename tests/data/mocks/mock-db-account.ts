import { AccountModel } from '@/domain/models/account'
import { AddAccount } from '@/domain/usecases'
import { AddAccountRepository, LoadAccountByEmailRepository, LoadAccountByTokenRepository, UpdateAccessTokenRepository } from '@/data/protocols'
import { mockAccountModel } from '@/tests/domain/mocks'

export class AddAccountRepositorySpy implements AddAccountRepository {
	accountModel = mockAccountModel()
  addAccountParams: AddAccount.Params

  async add (data: AddAccount.Params): Promise<AddAccountRepository.Result> {
    this.addAccountParams = data
    return await Promise.resolve(true)
  }
}

export class LoadAccountByEmailRepositorySpy implements LoadAccountByEmailRepository {
	accountModel = mockAccountModel()
	email: string

	async loadByEmail (email: string): Promise<AccountModel> {
		this.email = email
		return await Promise.resolve(this.accountModel)
	}
}

export class LoadAccountByTokenRepositorySpy implements LoadAccountByTokenRepository {
	accountModel = mockAccountModel()
	token: string
	role: string

	async loadByToken (token: string, role?: string): Promise<AccountModel> {
		this.token = token
		this.role = role
		return await Promise.resolve(this.accountModel)
	}
}

export class UpdateAccessTokenRepositorySpy implements UpdateAccessTokenRepository {
	id: string
	token: string

	async updateAccessToken (id: string, token: string): Promise<void> {
		this.id = id
		this.token = token
		return await Promise.resolve()
	}
}
