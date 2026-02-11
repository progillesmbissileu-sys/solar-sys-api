import { DimensionType } from '#shared/domain/dimension'
import { Command } from '#shared/application/use-cases/command'
import { AppFile } from '#shared/domain/app_file'

export class StoreImageCommand implements Command {
  readonly timestamp: Date

  constructor(
    public readonly file: AppFile,
    public readonly title: string,
    public readonly altDescription: string,
    public readonly dimension?: DimensionType
  ) {
    this.timestamp = new Date()
  }
}
