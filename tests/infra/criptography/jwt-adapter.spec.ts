import jwt from 'jsonwebtoken'
import { JwtAdapter } from '@/infra/criptography'

jest.mock('jsonwebtoken', () => ({
  sign (): string {
    return 'any_token'
  },
	verify (): string {
    return 'any_value'
  }
}))

const makeSut = (): JwtAdapter => {
  const sut = new JwtAdapter('any_secret')
  return sut
}

describe('JWT Adapter', () => {
	describe('encrypt()', () => {
		test('Should call sign with correct values', async () => {
			const sut = makeSut()

			const signSpy = jest.spyOn(jwt, 'sign')
			await sut.encrypt('any_id')

			expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'any_secret')
		})

		test('Should returns a token on sign success', async () => {
			const sut = makeSut()

			const accessToken = await sut.encrypt('any_id')

			expect(accessToken).toBe('any_token')
		})

		test('Should throws if sign thorws', async () => {
			const sut = makeSut()

			jest
				.spyOn(jwt, 'sign')
				.mockImplementationOnce(() => { throw new Error() })

			const promise = sut.encrypt('any_id')

			await expect(promise).rejects.toThrow()
		})
	})

	describe('decrypt()', () => {
		test('Should call verify with correct values', async () => {
			const sut = makeSut()

			const verifySpy = jest.spyOn(jwt, 'verify')
			await sut.decrypt('any_token')

			expect(verifySpy).toHaveBeenCalledWith('any_token', 'any_secret')
		})

		test('Should return a value on verify success', async () => {
			const sut = makeSut()

			const value = await sut.decrypt('any_token')

			expect(value).toEqual('any_value')
		})

		test('Should throws if verify thorws', async () => {
			const sut = makeSut()

			jest
				.spyOn(jwt, 'verify')
				.mockImplementationOnce(() => { throw new Error() })

			const promise = sut.decrypt('any_token')

			await expect(promise).rejects.toThrow()
		})
	})
})
