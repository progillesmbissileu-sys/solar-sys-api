import { LocalProviderConfig, LocalStorageProvider } from '#infra/local_storage_provider'
import { RailwayProviderConfig, RailwayStorageProvider } from '#infra/railway_storage_provider'
import { StorageProviderInterface } from '#shared/application/services/upload/storage_provider_interface'
import env from '#start/env'

export enum ProviderType {
  VERCEL = 'VERCEL',
  LOCAL = 'LOCAL',
  RAILWAY = 'RAILWAY',
}

export type ProviderConfig =
  | { type: ProviderType.LOCAL; config: LocalProviderConfig }
  | { type: ProviderType.RAILWAY; config: RailwayProviderConfig }

export class StorageProviderFactory {
  /**
   * Create a storage provider based on configuration
   */
  static createProvider(providerConfig: ProviderConfig): StorageProviderInterface {
    switch (providerConfig.type) {
      case ProviderType.LOCAL:
        return new LocalStorageProvider(providerConfig.config)

      case ProviderType.RAILWAY:
        return new RailwayStorageProvider(providerConfig.config)

      default:
        throw new Error(`Unknown provider type: ${(providerConfig as any).type}`)
    }
  }

  /**
   * Create provider from environment variables
   */
  static createFromEnv(): StorageProviderInterface {
    const providerType = process.env.STORAGE_PROVIDER as ProviderType

    if (!providerType) {
      throw new Error('STORAGE_PROVIDER environment variable is not set')
    }

    switch (providerType) {
      case ProviderType.LOCAL:
        return new LocalStorageProvider({
          storagePath: env.get('STORAGE_BASE_PATH') || './storage',
          baseUrl: env.get('LOCAL_STORAGE_URL') || 'http://localhost:3000/uploads',
          basePath: env.get('STORAGE_BASE_PATH'),
          imageBasePath: env.get('IMAGE_STORAGE_BASE_PATH'),
          documentBasePath: env.get('DOCUMENT_STORAGE_BASE_PATH'),
        })

      case ProviderType.RAILWAY: {
        const endpoint = env.get('RAILWAY_STORAGE_ENDPOINT')
        const accessKeyId = env.get('RAILWAY_STORAGE_ACCESS_KEY_ID')
        const secretAccessKey = env.get('RAILWAY_STORAGE_SECRET_ACCESS_KEY')
        const bucket = env.get('RAILWAY_STORAGE_BUCKET')

        if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) {
          throw new Error(
            'Missing required Railway storage environment variables: ' +
              'RAILWAY_STORAGE_ENDPOINT, RAILWAY_STORAGE_ACCESS_KEY_ID, ' +
              'RAILWAY_STORAGE_SECRET_ACCESS_KEY, RAILWAY_STORAGE_BUCKET'
          )
        }

        return new RailwayStorageProvider({
          endpoint,
          accessKeyId,
          secretAccessKey,
          bucket,
          region: env.get('RAILWAY_STORAGE_REGION') || 'us-east-1',
          basePath: env.get('STORAGE_BASE_PATH'),
          imageBasePath: env.get('IMAGE_STORAGE_BASE_PATH'),
          documentBasePath: env.get('DOCUMENT_STORAGE_BASE_PATH'),
        })
      }

      default:
        throw new Error(`Unknown provider type: ${providerType}`)
    }
  }
}
