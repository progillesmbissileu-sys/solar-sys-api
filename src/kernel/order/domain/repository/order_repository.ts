import { RepositoryInterface } from '#shared/infrastructure/repository_interface'
import { Order } from '../entity/order'

export interface OrderRepository extends RepositoryInterface {
  save(entity: Order): Promise<void>
  findById(id: string): Promise<Order>
  findAll(): Promise<Order[]>
  findByOrderNumber(orderNumber: string): Promise<Order | null>
  findByCustomerId(
    customerId: string,
    page?: number,
    limit?: number
  ): Promise<{
    data: Order[]
    meta: { total: number; perPage: number; currentPage: number; lastPage: number }
  }>
  findByStatus(
    status: string,
    page?: number,
    limit?: number
  ): Promise<{
    data: Order[]
    meta: { total: number; perPage: number; currentPage: number; lastPage: number }
  }>
  delete(id: string): Promise<void>
}
