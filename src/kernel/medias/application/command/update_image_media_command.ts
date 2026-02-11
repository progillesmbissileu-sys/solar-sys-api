import { DimensionType } from '#shared/domain/dimension'

export class UpdateImageMediaCommand {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly altDescription: string,
    public readonly url: string,
    public readonly dimension?: DimensionType
  ) {}
}
