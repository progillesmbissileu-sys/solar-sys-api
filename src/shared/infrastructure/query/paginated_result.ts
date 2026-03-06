import { PaginatedResultDto } from '#kernel/product/application/dto/product_read_dto'

type PaginateJsonResult<T> = {
  meta: PaginatedResultDto<T>['meta']
  data: T[]
}

export async function mapPaginatedResult<TInput = any, TOutput = TInput>(
  paginateResult: { toJSON(): PaginateJsonResult<TInput> },
  mapper: (item: TInput) => Promise<TOutput> | TOutput
): Promise<PaginatedResultDto<TOutput>> {
  const json = paginateResult.toJSON()

  return {
    meta: json.meta,
    data: await Promise.all(json.data.map((item) => mapper(item))),
  }
}
