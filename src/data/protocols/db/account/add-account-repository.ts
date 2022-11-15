import { AddAccount } from '@/domain/usecases'

export interface AddAccountRepository {
  add: (data: AddAccount.Params) => Promise<AddAccount.Result>
}

export namespace AddAccountRepository {
	export type Params = AddAccount.Params
	export type Result = boolean
}
