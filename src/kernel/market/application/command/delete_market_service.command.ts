import { Command } from '#shared/application/use-cases/command'
import { IdentifierInterface } from '#shared/domain/identifier_interface'

export class DeleteMarketServiceCommand implements Command {
  readonly timestamp: Date
  constructor(public serviceId: IdentifierInterface) {
    this.timestamp = new Date()
  }
}
