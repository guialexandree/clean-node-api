import { AccountModel } from '@/domain/models'

export interface GetAccountParams {
  email: string
}

export interface GetAccount {
  get: (account: GetAccountParams) => Promise<AccountModel>
}
