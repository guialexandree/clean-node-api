import { CheckSurveyById } from '@/domain/usecases'
import { CheckSurveyByIdRepository } from '../protocols'

export class DbCheckSurveyById implements CheckSurveyById {
	constructor (
		private readonly checkSurveyByIdRepository: CheckSurveyByIdRepository
	) {}

	async checkById (id: string): Promise<CheckSurveyById.Result> {
		return await this.checkSurveyByIdRepository.checkById(id)
	}
}
