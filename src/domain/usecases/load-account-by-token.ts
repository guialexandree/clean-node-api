import { AccountModel } from '../models/account'

export interface LoadByAccountByToken {
	load (accessToken: string) : Promise<AccountModel>
}
