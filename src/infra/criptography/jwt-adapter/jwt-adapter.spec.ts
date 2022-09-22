import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

const makeSut = () : JwtAdapter => {
	const sut = new JwtAdapter('any_secret')
	return sut
}

describe('JWT Adapter', () => {
	test('Should call sign with correct values', async () => {
		const sut = makeSut()

		const signSpy = jest.spyOn(jwt, 'sign')
		await sut.encrypt('any_id')

		expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'any_secret')
	})
})
