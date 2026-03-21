import { StoreStatus, StoreStatusEnum } from '../types'
import { BusinessHours } from '#shared/domain/value-objects/business_hours'
import { DomainError } from '#shared/domain/errors/domain_error'
import { AppId } from '#shared/domain/app_id'
import { PhoneNumber } from '#shared/domain/value-objects/phone_number'
import { Address } from '#shared/domain/value-objects/address'

export class Store {
  constructor(
    private id: AppId | null,
    private designation: string,
    private address: Address,
    private phoneNumber: PhoneNumber,
    private businessHours: Array<BusinessHours>,
    private managerId: AppId | null = null,
    private status: StoreStatus = { status: StoreStatusEnum.INACTIVE },
    private createdAt: Date | null = null,
    private updatedAt: Date | null = null
  ) {
    if (
      businessHours.some((ha, index) =>
        businessHours.some((hb, i) => BusinessHours.equalDays(ha, hb) && index !== i)
      )
    ) {
      let seed: BusinessHours = businessHours[0]
      const conflicting: BusinessHours = businessHours.find((ha, index) => {
        seed = ha
        return businessHours.some((hb, i) => BusinessHours.equalDays(ha, hb) && index !== i)
      })!

      throw new DomainError(
        'STORE_CONFLICTING_BUSINESS_HOURS',
        `Conflicting business hours : ${conflicting.toString()} and ${seed?.toString()}`
      )
    }
  }

  getId(): any {
    return this.id
  }

  getDesignation(): string {
    return this.designation
  }

  getBusinessHours(): Array<BusinessHours> {
    return this.businessHours
  }

  getStatus(): StoreStatus {
    return this.status
  }

  getCreatedAt(): any {
    return this.createdAt
  }
  getUpdatedAt(): any {
    return this.updatedAt
  }
}
