import { Command } from '#shared/application/use-cases/command'
import { AddressType } from '#kernel/customer/domain/type/address_type'

export class CreateAddressCommand implements Command {
  readonly timestamp: Date = new Date()

  constructor(
    public readonly customerId: string,
    public readonly addressLine1: string,
    public readonly addressLine2: string | null,
    public readonly city: string,
    public readonly state: string,
    public readonly postalCode: string,
    public readonly country: string,
    public readonly type: AddressType,
    public readonly isDefault: boolean
  ) {}
}
