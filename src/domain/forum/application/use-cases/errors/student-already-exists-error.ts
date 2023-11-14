import { UseCaseError } from '@/core/errors/use-case-error'

export class StudentAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifer: string) {
    super(`Student "${identifer}" already exists.`)
  }
}
