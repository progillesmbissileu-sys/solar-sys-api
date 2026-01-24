import { CommandBus } from '@/shared/infrastructure/bus/command.bus'
import { QueryBus } from '@/shared/infrastructure/bus/query.bus'

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    'CQRS/CommandBus': CommandBus
    'CQRS/QueryBus': QueryBus
  }
}
