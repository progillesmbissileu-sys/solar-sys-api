import { Command } from '#shared/application/use-cases/command'

export class CancelOrderCommand implements Command {
  readonly timestamp: Date = new Date()

  constructor(
    public readonly orderId: string,
    public readonly reason?: string
  ) {}
}
