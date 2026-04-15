import { Command } from '#shared/application/use-cases/command'

export class DetachModifierGroupFromProductCommand implements Command {
  readonly timestamp: Date

  constructor(
    public readonly productId: string,
    public readonly modifierGroupId: string
  ) {
    this.timestamp = new Date()
  }
}
