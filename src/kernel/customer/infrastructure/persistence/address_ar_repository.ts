import { AddressRepository } from '#kernel/customer/domain/repository/address_repository'
import { default as EntityActiveRecord } from '#database/active-records/address'
import { Address } from '#kernel/customer/domain/entity/address'
import { AddressType } from '#kernel/customer/domain/type/address_type'

export class AddressARRepository implements AddressRepository {
  async findById(id: string): Promise<Address> {
    const address = await EntityActiveRecord.findOrFail(id)

    return new Address(
      address.id,
      address.customerId,
      address.type as AddressType,
      address.addressLine1,
      address.addressLine2,
      address.city,
      address.state,
      address.postalCode,
      address.country,
      address.isDefault,
      address.createdAt as any,
      address.updatedAt as any
    )
  }

  async findByCustomerId(customerId: string): Promise<Address[]> {
    const addresses = await EntityActiveRecord.query().where('customer_id', customerId)

    return addresses.map((addr) => {
      return new Address(
        addr.id,
        addr.customerId,
        addr.type as AddressType,
        addr.addressLine1,
        addr.addressLine2,
        addr.city,
        addr.state,
        addr.postalCode,
        addr.country,
        addr.isDefault,
        addr.createdAt as any,
        addr.updatedAt as any
      )
    })
  }

  async save(entity: Address): Promise<void> {
    const object = {
      customerId: entity.getCustomerId() as any,
      type: entity.getType(),
      addressLine1: entity.getAddressLine1(),
      addressLine2: entity.getAddressLine2(),
      city: entity.getCity(),
      state: entity.getState(),
      postalCode: entity.getPostalCode(),
      country: entity.getCountry(),
      isDefault: entity.getIsDefault(),
    }

    if (entity.getId()) {
      await EntityActiveRecord.updateOrCreate({ id: entity.getId() as any }, object)
    } else {
      await EntityActiveRecord.create(object)
    }
  }

  async delete(id: string): Promise<void> {
    const address = await EntityActiveRecord.findOrFail(id)
    await address.delete()
  }
}
