import { Command } from '#shared/application/use-cases/command'
import app from '@adonisjs/core/services/app'
import { Query } from '#shared/application/use-cases/query'
import { ContainerBindings } from '@adonisjs/core/types'

export class AppAbstractController {
  protected async handleCommand<ReturnType>(command: Command) {
    const bus = await app.container.make('CQRS/CommandBus')

    return await bus.execute<Command, ReturnType>(command)
  }

  protected async handleQuery(command: Query) {
    const bus = await app.container.make('CQRS/QueryBus')

    return await bus.execute(command)
  }

  protected async getService(service: keyof ContainerBindings) {
    return await app.container.make(service)
  }
}
