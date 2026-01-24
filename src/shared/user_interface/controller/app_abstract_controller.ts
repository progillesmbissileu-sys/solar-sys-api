import { Command } from '#shared/application/use-cases/command'
import app from '@adonisjs/core/services/app'
import { Query } from '#shared/application/use-cases/query'

export class AppAbstractController {
  protected async handleCommand(command: Command) {
    const bus = await app.container.make('CQRS/CommandBus')

    return await bus.execute(command)
  }

  protected async handleQuery(command: Query) {
    const bus = await app.container.make('CQRS/QueryBus')

    return await bus.execute(command)
  }
}
