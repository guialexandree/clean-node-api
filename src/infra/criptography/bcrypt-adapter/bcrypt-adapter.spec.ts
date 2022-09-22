import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
	async hash (): Promise<string> {
		return new Promise(resolve => resolve('any_hash'))
	},
	async compare (): Promise<boolean> {
		return new Promise(resolve => resolve(true))
	}
}))

describe('Bcrypt Adapter', () => {
	const makeSut = () : BcryptAdapter => {
		const sut = new BcryptAdapter()
		return sut
	}

	test('Should call hash with correct values', async () => {
		const sut = makeSut()

		const hashSpy = jest.spyOn(bcrypt, 'hash')
		await sut.hash('any_value')

		expect(hashSpy).toHaveBeenCalledWith('any_value', sut.salt)
	})

	test('Should returns an hash if hash on success', async () => {
		const sut = makeSut()

		const hash = await sut.hash('any_value')

		expect(hash).toBe('any_hash')
	})

	test('Should throws if hash throws', () => {
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

	test('Should call compare with correct values', async () => {
		const sut = makeSut()

		const compareSpy = jest.spyOn(bcrypt, 'compare')
		await sut.compare('any_value', 'any_hash')

		expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
	})

	test('Should returns true if compare on success', async () => {
		const sut = makeSut()

		const isValid = await sut.compare('any_value', 'any_hash')

		expect(isValid).toBe(true)
	})

	test('Should throws if compare throws', () => {
		const sut = makeSut()
			jest
				.spyOn(bcrypt, 'compare')
				.mockImplementationOnce(() => { throw new Error() })

		const promise = sut.compare('any_value', 'any_hash')

		expect(promise).rejects.toThrow()
	})
})
