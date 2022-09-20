import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
	async hash (): Promise<string> {
		return new Promise(resolve => resolve('any_hash'))
	}
}))

describe('Bcrypt Adapter', () => {
	const makeSut = () : BcryptAdapter => {
		const sut = new BcryptAdapter()
		return sut
	}

	test('Should call bcrypt with correct values', async () => {
		const sut = makeSut()

		const hashSpy = jest.spyOn(bcrypt, 'hash')
		await sut.hash('any_value')

		expect(hashSpy).toHaveBeenCalledWith('any_value', sut.salt)
	})

	test('Should returns a to hash on success', async () => {
		const sut = makeSut()

		const hash = await sut.hash('any_value')

		expect(hash).toBe('any_hash')
	})

	test('Should throws if bcrypt throws', () => {
		const sut = makeSut()
		const hashSpy =
			jest
				.spyOn(bcrypt, 'hash') as unknown as jest.Mock<
					ReturnType<(key: string) => Promise<string>>,
					Parameters<(key: string) => Promise<string>>
				>
		hashSpy.mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

		const promise = sut.hash('any_value')

		expect(promise).rejects.toThrow()
	})
})
