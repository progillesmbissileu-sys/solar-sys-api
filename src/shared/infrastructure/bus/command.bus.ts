import { CommandHandler } from '@/shared/application/use-cases/command_handler'
import { Command } from '@/shared/application/use-cases/command'

export class CommandBus {
  private handlers: Map<string, CommandHandler<any, any>> = new Map()

  register<TCommand extends Command, TResult = void>(
    commandName: string,
    handler: CommandHandler<TCommand, TResult>
  ): void {
    this.handlers.set(commandName, handler)
  }

  async execute<TCommand extends Command, TResult = void>(command: TCommand): Promise<TResult> {
    const commandName = command.constructor.name
    const handler = this.handlers.get(commandName)

    if (!handler) {
      throw new Error(`No handler registered for command: ${commandName}`)
    }

    return handler.handle(command)
  }
}
