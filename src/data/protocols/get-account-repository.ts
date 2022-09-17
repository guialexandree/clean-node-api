import { GetAccountModel } from '../../domain/usecases/get-account'
import { AccountModel } from '../../domain/models/account'

export interface GetAccountRepository {
	get(getAccount: GetAccountModel) : Promise<AccountModel>
}
