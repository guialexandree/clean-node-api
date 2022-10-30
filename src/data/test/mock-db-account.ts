import { mockAccountModel } from '@/domain/test'
import { AccountModel } from '@/domain/models/account'
import { AddAccountParams } from '@/domain/usecases/account/add-account'
import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'
import { UpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository'

export const mockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountParams): Promise<AccountModel> {
      return await new Promise(resolve => resolve(mockAccountModel()))
    }
  }

  return new AddAccountRepositoryStub()
}

export const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      const account: AccountModel = mockAccountModel()
      return await new Promise(resolve => resolve(account))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

export const mockLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
	class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
		async loadByToken (accessToken: string, role?: string): Promise<AccountModel> {
			const account: AccountModel = mockAccountModel()
			return await new Promise(resolve => resolve(account))
		}
	}

	return new LoadAccountByTokenRepositoryStub()
}

export const mockAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (id: string, accessToken: string): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}
