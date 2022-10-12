import { Decrypter } from '@/data/protocols/criptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'

const makeDecrypter = (): Decrypter => {
	class DecrypterStub implements Decrypter {
		async decrypt (value: string): Promise<string> {
			return await new Promise(resolve => resolve('decrypted_value'))
		}
	}

	return new DecrypterStub()
}

type SutTypes = {
	sut: DbLoadAccountByToken
	decrypterStub: Decrypter
}

const makeSut = (): SutTypes => {
	const decrypterStub = makeDecrypter()
	const sut = new DbLoadAccountByToken(decrypterStub)

	return {
		sut,
		decrypterStub
	}
}

describe('DbLoadAccountByToken UseCase', () => {
	test('Should calls Decrypter with correct value', async () => {
		const { sut, decrypterStub } = makeSut()
		const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')

		await sut.load('any_token')

		expect(decryptSpy).toHaveBeenCalledWith('any_token')
	})
})
