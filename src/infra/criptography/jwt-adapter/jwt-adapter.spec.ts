import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  sign (): string {
    return 'any_token'
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

			void expect(promise).rejects.toThrow()
		})
	})
	describe('decrypt()', () => {})
})
