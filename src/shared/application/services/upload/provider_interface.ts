import { FileInfo, UploadResult, UploadOptions } from './types'

/**
 * Storage Provider Interface
 * All storage providers must implement this interface
 */
export interface StorageProviderInterface {
  /**
   * Upload a file to the storage provider
   */
  upload(file: FileInfo, options?: UploadOptions): Promise<UploadResult>

  /**
   * Delete a file from storage
   */
  delete(key: string): Promise<boolean>

  /**
   * Get a signed URL for temporary access
   */
  getSignedUrl(key: string, expiresIn?: number): Promise<string>

  /**
   * Check if a file exists
   */
  exists(key: string): Promise<boolean>

  /**
   * Get file metadata
   */
  getMetadata(key: string): Promise<Record<string, any> | null>
}
