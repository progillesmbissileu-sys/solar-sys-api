import { DimensionType } from '#shared/domain/dimension'

export class ImageMedia {
  constructor(
    private readonly id: string | null,
    private readonly title: string,
    private readonly url: string,
    private readonly altDescription: string,
    private readonly dimension?: DimensionType
  ) {}
}
