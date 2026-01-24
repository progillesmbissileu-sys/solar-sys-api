import { Query } from './query'

export interface QueryHandler<TQuery extends Query, TResult> {
  handle(command: TQuery): Promise<TResult>
}
