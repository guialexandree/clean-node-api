import { AccountModel } from '../../models/account'

export interface GetAccountParams {
  email: string
}

export interface GetAccount {
  get: (account: GetAccountParams) => Promise<AccountModel>
}
