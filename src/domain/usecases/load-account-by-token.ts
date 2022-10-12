import { AccountModel } from '../models/account'

export interface LoadByAccountByToken {
  load: (accessToken: string, role?: string) => Promise<AccountModel>
}
