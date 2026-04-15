import { Command } from '#shared/application/use-cases/command'

export class AttachModifierGroupToProductCommand implements Command {
  readonly timestamp: Date

  constructor(
    public readonly productId: string,
    public readonly modifierGroupId: string,
    public readonly sortIndex: number = 0
  ) {
    this.timestamp = new Date()
  }
}
