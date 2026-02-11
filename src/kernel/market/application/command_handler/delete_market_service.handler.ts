import { IdentifierInterface } from '#shared/domain/identifier_interface'

export class DeleteMarketServiceCommand {
  constructor(public serviceId: IdentifierInterface) {}
}
