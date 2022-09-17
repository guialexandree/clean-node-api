import { AccountModel } from '../models/account'

export interface GetAccountModel {
	email: string,
}

export interface GetAccount {
	get (account: GetAccountModel) : Promise<AccountModel>
}
