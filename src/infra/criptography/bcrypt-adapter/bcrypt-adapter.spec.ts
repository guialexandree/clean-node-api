import { throwError } from '@/domain/test'
import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await Promise.resolve('any_hash')
  },
  async compare (): Promise<boolean> {
    return await Promise.resolve(true)
  }
}))

describe('Bcrypt Adapter', () => {
  const makeSut = (): BcryptAdapter => {
    const sut = new BcryptAdapter()
    return sut
  }

	describe('hash()', () => {
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
				jest.spyOn(bcrypt, 'hash') as unknown as jest.Mock<
				ReturnType<(key: string) => Promise<string>>,
				Parameters<(key: string) => Promise<string>>
				>
			hashSpy.mockImplementationOnce(throwError)

			const promise = sut.hash('any_value')

			void expect(promise).rejects.toThrow()
		})
	})

	describe('compare()', () => {
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

			void expect(promise).rejects.toThrow()
		})
	})
})
