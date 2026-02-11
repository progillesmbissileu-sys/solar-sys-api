import { IdentifierInterface } from '#shared/domain/identifier_interface'

export class ImageMedia {
  constructor(
    private readonly id: IdentifierInterface | null,
    private readonly title: string,
    private readonly url: string,
    private readonly altDescription: string,
    private readonly metadata: any,
    private readonly createdAt: Date | null,
    private readonly updatedAt: Date | null,
    private readonly createdBy?: any
  ) {}

  getId() {
    return this.id?.value
  }
}
