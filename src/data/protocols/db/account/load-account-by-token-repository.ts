import { AccountModel } from '@/data/usecases/add-account/db-add-account-protocols'

export interface LoadAccountByTokenRepository {
  load: (accessToken: string) => Promise<AccountModel>
}
