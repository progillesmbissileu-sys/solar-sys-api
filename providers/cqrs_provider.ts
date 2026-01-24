import { QueryBus } from '@/shared/infrastructure/bus/query.bus'
import { CommandBus } from '@/shared/infrastructure/bus/command.bus'
import { ApplicationService } from '@adonisjs/core/types'

export default class CqrsProvider {
  constructor(protected app: ApplicationService) {}

  public register() {
    this.app.container.singleton('CQRS/CommandBus', () => {
      const commandBus = new CommandBus()

      // Register command handlers
      // commandBus.register('CreateUserCommand', new CreateUserCommandHandler())
      // commandBus.register('UpdateUserCommand', new UpdateUserCommandHandler())

      return commandBus
    })

    this.app.container.singleton('CQRS/QueryBus', () => {
      const queryBus = new QueryBus()

      // Register query handlers
      // queryBus.register('GetUserByIdQuery', new GetUserByIdQueryHandler())
      // queryBus.register('GetAllUsersQuery', new GetAllUsersQueryHandler())

      return queryBus
    })
  }

  public async boot() {}
  public async ready() {}
  public async shutdown() {}
}
