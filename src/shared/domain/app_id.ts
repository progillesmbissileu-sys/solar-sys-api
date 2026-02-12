import crypto from 'node:crypto'

export class AppId {
  constructor(private readonly _value: crypto.UUID) {}
  static generate() {
    return crypto.randomUUID()
  }

  static fromString(value: string) {
    return new AppId(value as crypto.UUID)
  }

  get value() {
    return this._value
  }
}
