import request from 'supertest'
import app from '../config/app'

describe('SignUp Routes', () => {
	test('Should return an account on success', async () => {
		await request(app)
			.post('/api/signup')
			.send({
				name: 'Guilherme Alexandre',
				email: 'guilherme_alexandre@hotmail.com',
				password: '_any_password',
				confirmPassword: '_any_password'
			})
			.expect(200)
	})
})
