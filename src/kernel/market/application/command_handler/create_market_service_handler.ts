import { MarketServiceRepository } from '#kernel/market/domain/repository/market_service_repository'
import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { CreateMarketServiceCommand } from '#kernel/market/application/command/create_market_service_command'
import { MarketService } from '#kernel/market/domain/entity/market_service'

export class CreateMarketServiceHandler implements CommandHandler<CreateMarketServiceCommand> {
  constructor(public repository: MarketServiceRepository) {}

  async handle(command: CreateMarketServiceCommand): Promise<void> {
    await this.repository.save(
      new MarketService(
        null,
        command.designation,
        command.thumbnail,
        command.thumbnailId,
        null,
        command.shortDescription,
        command.features
      )
    )
  }
}
