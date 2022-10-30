import { Decrypter } from '@/data/protocols/criptography/decrypter'
import { Encrypter } from '@/data/protocols/criptography/encrypter'
import { Hasher } from '@/data/protocols/criptography/hasher'
import { HashComparer } from '@/data/protocols/criptography/hash-comparer'

export const mockEncrypter = (): Encrypter => {
	class EncrypterStub implements Encrypter {
		async encrypt (id: string): Promise<string> {
			return await new Promise(resolve => resolve('any_token'))
		}
	}
	return new EncrypterStub()
}

export const mockDecrypter = (): Decrypter => {
	class DecrypterStub implements Decrypter {
		async decrypt (value: string): Promise<string> {
			return await new Promise(resolve => resolve('decrypted_value'))
		}
	}

	return new DecrypterStub()
}

export const mockHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await new Promise(resolve => resolve('hashed_password'))
    }
  }

  return new HasherStub()
}

export const mockHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hashed: string): Promise<boolean> {
      return await new Promise(resolve => resolve(true))
    }
  }
  return new HashComparerStub()
}
