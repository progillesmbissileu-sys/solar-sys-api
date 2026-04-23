import { AppId } from '#shared/domain/app_id'

export class MediaCollection {
  constructor(
    private readonly id: AppId | null,
    private readonly name: string,
    private readonly description: string | null,
    private readonly createdAt: Date | null,
    private readonly updatedAt: Date | null
  ) {}

  getId() {
    return this.id?.value
  }

  getName(): string {
    return this.name
  }

  getDescription(): string | null {
    return this.description
  }

  getCreatedAt(): Date | null {
    return this.createdAt
  }

  getUpdatedAt(): Date | null {
    return this.updatedAt
  }
}
