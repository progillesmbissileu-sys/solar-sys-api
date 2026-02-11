import crypto from 'node:crypto'

export class IdentifierInterface {
  constructor(readonly value: crypto.UUID) {}
  static generate() {
    return crypto.randomUUID()
  }
}
