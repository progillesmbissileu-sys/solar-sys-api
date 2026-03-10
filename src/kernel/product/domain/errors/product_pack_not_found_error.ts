export class ProductPackNotFoundError extends Error {
  constructor(
    public readonly packId: string,
    cause?: Error
  ) {
    super(`Product pack with id "${packId}" not found`)
    this.name = 'ProductPackNotFoundError'
    if (cause) {
      this.cause = cause
    }
  }
}
