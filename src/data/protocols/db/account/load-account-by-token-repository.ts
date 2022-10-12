import { AccountModel } from '@/data/usecases/add-account/db-add-account-protocols'

export interface LoadAccountByEmailRepository {
  loadByAccessToken: (accessToken: string) => Promise<AccountModel>
}
