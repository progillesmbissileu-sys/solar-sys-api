import { MarketServiceFeature } from '#kernel/market/domain/type/market_service_feature_type'
import { Command } from '#shared/application/use-cases/command'
import { AppId } from '#shared/domain/app_id'

export class CreateMarketServiceCommand implements Command {
  readonly timestamp: Date

  constructor(
    public designation: string,
    public thumbnail: string,
    public thumbnailId: AppId,
    public shortDescription?: string,
    public features?: Array<MarketServiceFeature>
  ) {
    this.timestamp = new Date()
  }
}
