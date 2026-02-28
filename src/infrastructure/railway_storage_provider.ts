import * as path from 'node:path'
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { cuid as uuidv4 } from '@adonisjs/core/helpers'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { StorageProviderInterface } from '#shared/application/services/upload/storage_provider_interface'
import {
  FileInfo,
  MediaType,
  UploadOptions,
  UploadResult,
} from '#shared/application/services/upload/types'

export interface RailwayProviderConfig {
  /**
   * Railway S3-compatible endpoint URL
   * e.g. https://<bucket>.s3.us-east-1.amazonaws.com  or the Railway-provided endpoint
   */
  endpoint: string

  /**
   * Railway object storage access key ID
   */
  accessKeyId: string

  /**
   * Railway object storage secret access key
   */
  secretAccessKey: string

  /**
   * Railway object storage bucket name
   */
  bucket: string

  /**
   * AWS region (Railway uses us-east-1 by default)
   */
  region?: string

  /**
   * Optional base path prefix for all uploaded objects
   */
  basePath?: string

  /**
   * Optional sub-path for image objects (appended after basePath)
   */
  imageBasePath?: string

  /**
   * Optional sub-path for document objects (appended after basePath)
   */
  documentBasePath?: string
}

/**
 * Railway Object Storage Provider
 *
 * Uploads files directly to Railway's S3-compatible object storage using
 * the AWS SDK v3. The backend does NOT serve these files to clients —
 * consumers should access them via the public bucket URL or a signed URL.
 */
export class RailwayStorageProvider implements StorageProviderInterface {
  private readonly client: S3Client
  private readonly bucket: string
  private readonly endpoint: string
  private readonly basePath: string
  private readonly imageBasePath: string
  private readonly documentBasePath: string

  constructor(config: RailwayProviderConfig) {
    this.bucket = config.bucket
    this.endpoint = config.endpoint
    this.basePath = config.basePath ?? ''
    this.imageBasePath = config.imageBasePath ?? 'images'
    this.documentBasePath = config.documentBasePath ?? 'documents'

    this.client = new S3Client({
      endpoint: config.endpoint,
      region: config.region ?? 'us-east-1',
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      /**
       * Railway's object storage uses path-style URLs
       * (e.g. https://endpoint/<bucket>/<key>) rather than
       * virtual-hosted-style URLs.
       */
      forcePathStyle: true,
    })
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  async upload(
    fileInfo: FileInfo,
    file?: MultipartFile,
    _options?: UploadOptions
  ): Promise<UploadResult> {
    try {
      const fileName = this.generateFileName(fileInfo.originalName)
      const subPath = fileInfo.type === MediaType.IMAGE ? this.imageBasePath : this.documentBasePath
      const objectKey = this.buildKey(subPath, fileName)

      // Obtain the raw buffer — prefer the MultipartFile stream when available
      const body = await this.resolveBody(fileInfo, file)

      await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: objectKey,
          Body: body,
          ContentType: fileInfo.mimeType,
          ContentLength: fileInfo.size,
          Metadata: {
            originalName: fileInfo.originalName,
          },
        })
      )

      // Build a public URL pointing directly at the object.
      // The backend does NOT proxy this URL — clients use it directly.
      const url = this.buildPublicUrl(objectKey)

      return {
        success: true,
        url,
        key: objectKey,
        metadata: {
          originalName: fileInfo.originalName,
          size: fileInfo.size,
          mimeType: fileInfo.mimeType,
          uploadedAt: new Date(),
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload to Railway storage failed',
      }
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        })
      )
      return true
    } catch {
      return false
    }
  }

  async getSignedUrl(key: string, expiresIn?: number): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    })

    return getSignedUrl(this.client, command, {
      expiresIn: expiresIn ?? 60 * 60 * 24, // default: 24 hours
    })
  }

  async exists(key: string): Promise<boolean> {
    try {
      await this.client.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: key,
        })
      )
      return true
    } catch {
      return false
    }
  }

  async getMetadata(key: string): Promise<Record<string, any> | null> {
    try {
      const response = await this.client.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: key,
        })
      )

      return {
        contentType: response.ContentType,
        contentLength: response.ContentLength,
        lastModified: response.LastModified,
        eTag: response.ETag,
        metadata: response.Metadata ?? {},
      }
    } catch {
      return null
    }
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  /**
   * Build the full S3 object key from optional base path, sub-path and filename.
   */
  private buildKey(...segments: string[]): string {
    const parts = [this.basePath, ...segments].filter(Boolean)
    // Normalise to forward-slash separators (S3 convention)
    return parts.join('/').replace(/\\/g, '/')
  }

  /**
   * Construct a public URL for the uploaded object.
   * Railway exposes objects at: <endpoint>/<bucket>/<key>
   */
  private buildPublicUrl(key: string): string {
    // Strip trailing slash from endpoint, then compose the URL
    const base = this.endpoint.replace(/\/$/, '')
    return `${base}/${this.bucket}/${key}`
  }

  /**
   * Resolve the upload body from either the raw buffer on FileInfo or the
   * MultipartFile's temporary path on disk.
   */
  private async resolveBody(fileInfo: FileInfo, file?: MultipartFile): Promise<Buffer> {
    if (fileInfo.buffer && fileInfo.buffer.length > 0) {
      return fileInfo.buffer
    }

    if (file?.tmpPath) {
      const { readFile } = await import('node:fs/promises')
      return readFile(file.tmpPath)
    }

    throw new Error('No file content available for upload: neither buffer nor tmpPath is set')
  }

  /**
   * Generate a unique filename preserving the original extension.
   */
  private generateFileName(originalName: string): string {
    const timestamp = Date.now()
    const uuid = uuidv4()
    const extension = path.extname(originalName) || ''
    return `${timestamp}-${uuid}${extension}`
  }
}
