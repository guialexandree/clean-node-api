import { type AddAccount } from '@/domain/usecases'
import { type AddAccountRepository, type CheckAccountByEmailRepository, type LoadAccountByEmailRepository, type LoadAccountByTokenRepository, type UpdateAccessTokenRepository } from '@/data/protocols'
import faker from 'faker'
export class AddAccountRepositorySpy implements AddAccountRepository {
	result = true
  addAccountParams: AddAccount.Params

  async add (data: AddAccount.Params): Promise<AddAccountRepository.Result> {
    this.addAccountParams = data
    return await Promise.resolve(this.result)
  }
}

export class LoadAccountByEmailRepositorySpy implements LoadAccountByEmailRepository {
	result = {
		id: faker.datatype.uuid(),
		name: faker.name.findName(),
		password: faker.internet.password()
	}

	email: string

	async loadByEmail (email: string): Promise<LoadAccountByEmailRepository.Result> {
		this.email = email
		return await Promise.resolve(this.result)
	}
}

export class CheckAccountByEmailRepositorySpy implements CheckAccountByEmailRepository {
	result = false
	email: string

	async checkByEmail (email: string): Promise<CheckAccountByEmailRepository.Result> {
		this.email = email
		return await Promise.resolve(this.result)
	}
}

export class LoadAccountByTokenRepositorySpy implements LoadAccountByTokenRepository {
	result = { id: faker.datatype.uuid() }
	token: string
	role: string

	async loadByToken (token: string, role?: string): Promise<LoadAccountByTokenRepository.Result> {
		this.token = token
		this.role = role
		return await Promise.resolve(this.result)
	}
}

export class UpdateAccessTokenRepositorySpy implements UpdateAccessTokenRepository {
	id: string
	token: string

	async updateAccessToken (id: string, token: string): Promise<void> {
		this.id = id
		this.token = token
		await Promise.resolve()
	}
}
