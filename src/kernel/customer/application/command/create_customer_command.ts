import { Command } from '#shared/application/use-cases/command'

export class CreateCustomerCommand implements Command {
  readonly timestamp: Date

  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly phone?: string,
    public readonly userId?: string
  ) {
    this.timestamp = new Date()
  }
}
