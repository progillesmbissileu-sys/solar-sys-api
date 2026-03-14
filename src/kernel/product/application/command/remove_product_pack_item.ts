import { Command } from '#shared/application/use-cases/command'
import { AppId } from '#shared/domain/app_id'

export class RemoveProductPackItemCommand implements Command {
  readonly timestamp: Date
  constructor(public readonly itemId: AppId) {
    this.timestamp = new Date()
  }
}
