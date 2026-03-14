import { Command } from '#shared/application/use-cases/command'

export class SetProductPackStockCommand implements Command {
  readonly timestamp: Date

  constructor(
    public readonly packId: string,
    public readonly quantity: number | null
  ) {
    this.timestamp = new Date()
  }
}
