import { Hours } from './app_hour'
import { BusinessDay, DayOfWeek } from './business_day'

export class BusinessHours {
  private constructor(
    readonly day: BusinessDay,
    readonly open: Hours,
    readonly close: Hours
  ) {
    if (open.toTwentyFour() >= close.toTwentyFour())
      throw new Error(
        `Open (${open.toTwelveString()}) must be before close (${close.toTwelveString()})`
      )
  }

  static of(day: BusinessDay, open: Hours, close: Hours): BusinessHours {
    return new BusinessHours(day, open, close)
  }

  /** Convenience: accepts 24h integers */
  static from(day: DayOfWeek, openH: number, closeH: number): BusinessHours {
    return new BusinessHours(BusinessDay.of(day), Hours.of(openH), Hours.of(closeH))
  }

  // --- Queries ---

  isOpenAt(hour: Hours): boolean {
    const h = hour.toTwentyFour()
    return h >= this.open.toTwentyFour() && h < this.close.toTwentyFour()
  }

  isOpenNow(): boolean {
    const today = BusinessDay.today()
    if (!today.equals(this.day)) return false
    return this.isOpenAt(Hours.of(new Date().getHours()))
  }

  durationHours(): number {
    return this.close.toTwentyFour() - this.open.toTwentyFour()
  }

  // --- Display ---

  toString(): string {
    return `${this.day}: ${this.open.toTwelveString()} – ${this.close.toTwelveString()}`
  }
}
