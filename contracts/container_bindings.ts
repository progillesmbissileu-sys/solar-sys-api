import { CommandBus } from '#shared/infrastructure/bus/command_bus'
import { QueryBus } from '#shared/infrastructure/bus/query_bus'
import { RepositoryInterface } from '#shared/infrastructure/repository_interface'
import { MediaManagerInterface } from '#shared/application/services/upload/media_manager_interface'
import type { CustomerRepository } from '#kernel/customer/domain/repository/customer_repository'
import type { AddressRepository } from '#kernel/customer/domain/repository/address_repository'
import { ProductCollection } from '#kernel/product/application/collection/product_collection'
import { ProductReadModel } from '#kernel/product/application/read-model/product_read_model'
import { ProductCategoryCollection } from '#kernel/product/application/collection/product_category_collection'
import { ProductCategoryReadModel } from '#kernel/product/application/read-model/product_category_read_model'
import { StockCollection } from '#kernel/product/application/collection/stock_collection'
import { StockReadModel } from '#kernel/product/application/read-model/stock_read_model'
import { ProductPackCollection } from '#kernel/product/application/collection/product_pack_collection'
import { ProductPackReadModel } from '#kernel/product/application/read-model/product_pack_read_model'
import type { ProductPackRepository } from '#kernel/product/domain/repository/product_pack_repository'
import { ProductPackItemRepository } from '#kernel/product/domain/repository/product_pack_item_repository'
import { MarketServiceCollection } from '#kernel/market/application/collection/market_service_collection'
import { MarketServiceReadModel } from '#kernel/market/application/read-model/market_service_read_model'
import type { StaffMemberRepository } from '#kernel/staff/domain/repository/staff_member_repository'
import { StaffMemberCollection } from '#kernel/staff/application/collection/staff_member_collection'
import { StoreCollection } from '#kernel/store/application/collection/store_collection'
import { StoreReadModel } from '#kernel/store/application/read_model/store_read_model'
import { ProductModifierGroupCollection } from '#kernel/product/application/collection/product_modifier_group_collection'
import { ProductModifierGroupReadModel } from '#kernel/product/application/read-model/product_modifier_group_read_model'
import { ProductModifierCollection } from '#kernel/product/application/collection/product_modifier_collection'
import { ProductModifierReadModel } from '#kernel/product/application/read-model/product_modifier_read_model'
import type { ProductModifierGroupRepository } from '#kernel/product/domain/repository/product_modifier_group_repository'
import type { ProductModifierRepository } from '#kernel/product/domain/repository/product_modifier_repository'

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    'CQRS/CommandBus': CommandBus
    'CQRS/QueryBus': QueryBus

    //AGGREGATES REPOSITORY
    'StoreRepository': RepositoryInterface
    'ProductRepository': RepositoryInterface
    'ProductCategoryRepository': RepositoryInterface
    'MarketServiceRepository': RepositoryInterface
    'ImageMediaRepository': RepositoryInterface
    'StockMovementRepository': RepositoryInterface
    'CustomerRepository': CustomerRepository
    'AddressRepository': AddressRepository
    'OrderRepository': RepositoryInterface
    'ProductImageRepository': RepositoryInterface
    'ProductPackRepository': ProductPackRepository
    'ProductPackItemRepository': ProductPackItemRepository
    'StaffMemberRepository': StaffMemberRepository
    'ProductModifierGroupRepository': ProductModifierGroupRepository
    'ProductModifierRepository': ProductModifierRepository

    // READ MODELS
    'ProductCollection': ProductCollection
    'ProductReadModel': ProductReadModel
    'ProductCategoryCollection': ProductCategoryCollection
    'ProductCategoryReadModel': ProductCategoryReadModel
    'StockCollection': StockCollection
    'StockReadModel': StockReadModel
    'ProductPackCollection': ProductPackCollection
    'ProductPackReadModel': ProductPackReadModel
    'MarketServiceCollection': MarketServiceCollection
    'MarketServiceReadModel': MarketServiceReadModel
    'StaffMemberCollection': StaffMemberCollection
    'StoreCollection': StoreCollection
    'StoreReadModel': StoreReadModel
    'ProductModifierGroupCollection': ProductModifierGroupCollection
    'ProductModifierGroupReadModel': ProductModifierGroupReadModel
    'ProductModifierCollection': ProductModifierCollection
    'ProductModifierReadModel': ProductModifierReadModel

    //SERVICE
    'MediaUploadService': MediaManagerInterface
  }
}
