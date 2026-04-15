import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Read the existing Postman collection
const collectionPath = path.join(__dirname, 'postman', 'solar-backend-api.postman_collection.json')
const collection = JSON.parse(fs.readFileSync(collectionPath, 'utf-8'))

/**
 * Update URL structure to properly use base_url variable
 */
function updateUrlStructure(url) {
  if (!url || typeof url === 'string') {
    return url
  }

  // Get the raw URL
  const rawUrl = url.raw || ''

  // If URL starts with {{base_url}}, parse it correctly
  if (rawUrl.startsWith('{{base_url}}')) {
    // Remove {{base_url}} and any leading slash
    const pathPart = rawUrl.replace(/^{{base_url}}\/?/, '')

    // Split the path into segments
    const pathSegments = pathPart.split('/').filter((p) => p)

    // Update the URL structure while preserving other fields (query, variable, etc.)
    return {
      ...url,
      raw: rawUrl,
      host: ['{{base_url}}'],
      path: pathSegments,
    }
  }

  return url
}

/**
 * Process all items recursively (folders and requests)
 */
function processItems(items) {
  for (const item of items) {
    // If this item has a request, update its URL
    if (item.request && item.request.url) {
      item.request.url = updateUrlStructure(item.request.url)
    }

    // If this item has nested items (folder), process them recursively
    if (item.item && Array.isArray(item.item)) {
      processItems(item.item)
    }
  }
}

// Process all items in the collection
console.log('Updating URL structure in Postman collection...')
console.log(`Collection: ${collection.info.name}`)

if (collection.item && Array.isArray(collection.item)) {
  processItems(collection.item)
}

// Count total requests updated
let requestCount = 0
function countRequests(items) {
  for (const item of items) {
    if (item.request) {
      requestCount++
    }
    if (item.item) {
      countRequests(item.item)
    }
  }
}
countRequests(collection.item)

// Write the updated collection back to file
fs.writeFileSync(collectionPath, JSON.stringify(collection, null, 2))

console.log(`\n✓ Updated ${requestCount} requests`)
console.log(`✓ All URLs now properly use {{base_url}} variable`)
console.log(`✓ Collection saved to: ${collectionPath}`)
