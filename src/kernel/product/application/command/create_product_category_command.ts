import { Command } from '#shared/application/use-cases/command'

export class CreateProductCategoryCommand implements Command {
  readonly timestamp: Date

  constructor(
    public readonly designation: string,
    public readonly categoryType: 'CATEGORY' | 'TAG' = 'CATEGORY',
    public readonly parentId: any = null
  ) {
    this.timestamp = new Date()
  }
}
