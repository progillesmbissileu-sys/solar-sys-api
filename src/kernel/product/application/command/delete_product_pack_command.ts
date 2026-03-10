import { Command } from '#shared/application/use-cases/command'

export class DeleteProductPackCommand implements Command {
  readonly timestamp: Date

  constructor(public readonly packId: string) {
    this.timestamp = new Date()
  }
}
