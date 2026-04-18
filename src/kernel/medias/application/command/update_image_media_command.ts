import { Command } from '#shared/application/use-cases/command'

export class UpdateImageMediaCommand implements Command {
  readonly timestamp: Date

  constructor(
    public readonly id: string,
    public readonly title?: string,
    public readonly altDescription?: string,
    public readonly url?: string
  ) {
    this.timestamp = new Date()
  }
}
