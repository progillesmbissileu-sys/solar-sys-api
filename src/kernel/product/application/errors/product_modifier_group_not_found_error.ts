export class ProductModifierGroupNotFoundError extends Error {
  constructor(
    public readonly id: string,
    cause?: Error
  ) {
    super(`ProductModifierGroup with id "${id}" not found`)
    this.name = 'ProductModifierGroupNotFoundError'
    this.cause = cause
  }
}
