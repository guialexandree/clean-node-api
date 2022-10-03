import { AccountModel } from '../models/account'

export type GetAccountModel = {
	email: string,
}

export interface GetAccount {
	get (account: GetAccountModel) : Promise<AccountModel>
}
