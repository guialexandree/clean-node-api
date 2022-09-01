import { rejects } from 'assert'
import bcrypt from 'bcrypt'
import { BcryptAdapater } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
	async hash (): Promise<string> {
		return new Promise(resolve => resolve('any_hash'))
	}
}))

describe('Bcrypt Adapter', () => {
	const makeSut = () : BcryptAdapater => {
		const sut = new BcryptAdapater()
		return sut
	}

	test('Should call bcrypt with correct values', async () => {
		const sut = makeSut()

		const hashSpy = jest.spyOn(bcrypt, 'hash')
		await sut.encrypt('any_value')

		expect(hashSpy).toHaveBeenCalledWith('any_value', sut.salt)
	})

	test('Should returns a to hash on success', async () => {
		const sut = makeSut()

		const hash = await sut.encrypt('any_value')

		expect(hash).toBe('any_hash')
	})

	test('Should throws if bcrypt throws', () => {
		const sut = makeSut()

		const hashSpy = jest.spyOn(bcrypt, 'hash') as unknown as jest.Mock<
			ReturnType<(key: string) => Promise<string>>,
			Parameters<(key: string) => Promise<string>>
		>
		hashSpy.mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
		const promise = sut.encrypt('any_value')

		expect(promise).rejects.toThrow()
	})
})
