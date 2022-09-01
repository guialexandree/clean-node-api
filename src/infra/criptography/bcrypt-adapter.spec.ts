import bcrypt from 'bcrypt'
import { BcryptAdapater } from './bcrypt-adapter'

describe('Bcrypt Adapter', () => {
	const makeSut = () => {
		const sut = new BcryptAdapater()
		return { sut }
	}

	test('Should call bcrypt with correct values', async () => {
		const { sut } = makeSut()

		const hashSpy = jest.spyOn(bcrypt, 'hash')
		await sut.encrypt('any_value')

		expect(hashSpy).toHaveBeenCalledWith('any_value', sut.salt)
	})
})
