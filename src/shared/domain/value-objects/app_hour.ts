export type TimePeriod = 'AM' | 'PM' | 'FULL'

export class Hours {
  private readonly value: number

  private constructor(value: number) {
    this.value = value
  }

  static of(value: number): Hours {
    if (!Number.isFinite(value)) {
      throw new Error('Hours must be a finite number')
    }
    if (value < 0 || value > 23) {
      throw new Error('Hours must be between 0 and 23')
    }
    return new Hours(value)
  }

  static fromTwelve(hour: number, period: TimePeriod): Hours {
    if (!Number.isInteger(hour)) throw new Error('Hours must be an integer')
    if (hour < 1 || hour > 12) throw new Error('12-hour value must be between 1 and 12')

    let h24: number
    if (period === 'AM') {
      h24 = hour === 12 ? 0 : hour // 12 AM → 0
    } else {
      h24 = hour === 12 ? 12 : hour + 12 // 12 PM → 12, 1 PM → 13
    }
    return new Hours(h24)
  }

  static toJson(hours: Hours): { hours: number } {
    return {
      hours: hours.value,
    }
  }

  toTwentyFour(): number {
    return this.value
  }

  toTwelve(): { hour: number; period: TimePeriod } {
    if (this.value === 0) return { hour: 12, period: 'AM' }
    if (this.value === 12) return { hour: 12, period: 'PM' }
    return this.value < 12
      ? { hour: this.value, period: 'AM' }
      : { hour: this.value - 12, period: 'PM' }
  }

  period(): TimePeriod {
    return this.value < 12 ? 'AM' : 'PM'
  }

  toNumber(): number {
    return this.value
  }

  toMinutes(): number {
    return this.value * 60
  }

  toSeconds(): number {
    return this.value * 3600
  }

  add(other: Hours): Hours {
    return Hours.of((this.value + other.value) % 24)
  }

  equals(other: Hours): boolean {
    return this.value === other.value
  }

  // --- Display ---

  /** "14:00" */
  toString(): string {
    return `${String(this.value).padStart(2, '0')}:00`
  }

  /** "2:00 PM" */
  toTwelveString(): string {
    const { hour, period } = this.toTwelve()
    return `${hour}:00 ${period}`
  }
}
