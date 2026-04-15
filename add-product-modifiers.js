import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Read the existing Postman collection
const collectionPath = path.join(__dirname, 'postman', 'solar-backend-api.postman_collection.json')
const collection = JSON.parse(fs.readFileSync(collectionPath, 'utf-8'))

// Helper function to create a Postman request item
function createRequest(name, method, urlPath, body = null, description = null, pathParams = [], queryParams = []) {
  const item = {
    name: name,
    request: {
      method: method,
      header: [],
      url: {
        raw: `{{base_url}}${urlPath}`,
        host: ['{{base_url}}'],
        path: urlPath.replace(/^\//, '').split('/'),
      },
      auth: {
        type: 'bearer',
        bearer: [
          {
            key: 'token',
            value: '{{access_token}}',
            type: 'string',
          },
        ],
      },
    },
  }

  // Add description if provided
  if (description) {
    item.request.description = description
  }

  // Add path parameters
  if (pathParams.length > 0) {
    item.request.url.variable = pathParams.map((param) => ({
      key: param.key,
      value: param.value,
    }))
  }

  // Add query parameters
  if (queryParams.length > 0) {
    item.request.url.query = queryParams.map((param) => ({
      key: param.key,
      value: param.value,
      disabled: param.disabled || false,
    }))
  }

  // Add body if provided
  if (body) {
    item.request.body = {
      mode: 'raw',
      raw: JSON.stringify(body, null, 2),
      options: {
        raw: {
          language: 'json',
        },
      },
    }
  }

  return item
}

// Create Product Modifiers folder with all endpoints
const productModifiersFolder = {
  name: 'Product Modifiers',
  item: [
    // ============================================
    // Modifier Group Endpoints
    // ============================================
    createRequest(
      'List Modifier Groups',
      'GET',
      '/api/product-modifier-groups',
      null,
      `# List Modifier Groups

Retrieves a paginated list of all product modifier groups.

## Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 10 | Items per page |
| q | string | - | Search term to filter by designation |
| sortBy | string | createdAt | Sort field |
| sortOrder | string | desc | Sort order (asc/desc) |

## Response

- **200 OK**: Returns paginated list of modifier groups`,
      [],
      [
        { key: 'page', value: '1', disabled: true },
        { key: 'limit', value: '10', disabled: true },
        { key: 'q', value: 'search term', disabled: true },
      ]
    ),

    createRequest(
      'Create Modifier Group',
      'POST',
      '/api/product-modifier-groups',
      {
        designation: 'Size Options',
        minSelections: 0,
        maxSelections: 1,
        selectionType: 'single',
        required: false,
        available: true,
        sortOrder: 0,
      },
      `# Create Modifier Group

Creates a new product modifier group.

## Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| designation | string | Yes | Group name (2-255 characters) |
| minSelections | number | No | Minimum selections allowed (default: 0) |
| maxSelections | number | No | Maximum selections allowed (nullable) |
| selectionType | string | No | Selection type: "single" or "multi" (default: "multi") |
| required | boolean | No | Whether selection is required (default: false) |
| available | boolean | No | Whether group is available (default: true) |
| sortOrder | number | No | Sort order (default: 0) |

## Response

- **201 Created**: Modifier group created successfully
- **422 Unprocessable Entity**: Validation error`
    ),

    createRequest(
      'Get Modifier Group',
      'GET',
      '/api/product-modifier-groups/:id',
      null,
      `# Get Modifier Group

Retrieves a single modifier group by ID.

## Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| id | uuid | Modifier group ID |

## Response

- **200 OK**: Returns modifier group data
- **404 Not Found**: Modifier group not found`,
      [{ key: 'id', value: '550e8400-e29b-41d4-a716-446655440000' }]
    ),

    createRequest(
      'Update Modifier Group',
      'PUT',
      '/api/product-modifier-groups/:id',
      {
        designation: 'Updated Size Options',
        minSelections: 1,
        maxSelections: 3,
        selectionType: 'multi',
        required: true,
        available: true,
        sortOrder: 1,
      },
      `# Update Modifier Group

Updates an existing modifier group.

## Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| id | uuid | Modifier group ID |

## Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| designation | string | Yes | Group name (2-255 characters) |
| minSelections | number | No | Minimum selections allowed |
| maxSelections | number | No | Maximum selections allowed (nullable) |
| selectionType | string | No | Selection type: "single" or "multi" |
| required | boolean | No | Whether selection is required |
| available | boolean | No | Whether group is available |
| sortOrder | number | No | Sort order |

## Response

- **204 No Content**: Modifier group updated successfully
- **404 Not Found**: Modifier group not found
- **422 Unprocessable Entity**: Validation error`,
      [{ key: 'id', value: '550e8400-e29b-41d4-a716-446655440000' }]
    ),

    createRequest(
      'Delete Modifier Group',
      'DELETE',
      '/api/product-modifier-groups/:id',
      null,
      `# Delete Modifier Group

Deletes a modifier group and all its associated modifiers.

## Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| id | uuid | Modifier group ID |

## Response

- **204 No Content**: Modifier group deleted successfully
- **404 Not Found**: Modifier group not found`,
      [{ key: 'id', value: '550e8400-e29b-41d4-a716-446655440000' }]
    ),

    // ============================================
    // Modifier Endpoints (nested under groups)
    // ============================================
    createRequest(
      'List Modifiers',
      'GET',
      '/api/product-modifier-groups/:id/modifiers',
      null,
      `# List Modifiers

Retrieves a paginated list of all modifiers within a modifier group.

## Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| id | uuid | Modifier group ID |

## Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 10 | Items per page |
| q | string | - | Search term to filter by designation |
| sortBy | string | sortOrder | Sort field |
| sortOrder | string | asc | Sort order (asc/desc) |

## Response

- **200 OK**: Returns paginated list of modifiers
- **404 Not Found**: Modifier group not found`,
      [{ key: 'id', value: '550e8400-e29b-41d4-a716-446655440000' }],
      [
        { key: 'page', value: '1', disabled: true },
        { key: 'limit', value: '10', disabled: true },
        { key: 'q', value: 'search term', disabled: true },
      ]
    ),

    createRequest(
      'Create Modifier',
      'POST',
      '/api/product-modifier-groups/:id/modifiers',
      {
        designation: 'Large',
        priceAdjustment: 2.5,
        adjustmentType: 'fixed',
        available: true,
        sortOrder: 0,
      },
      `# Create Modifier

Creates a new modifier within a modifier group.

## Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| id | uuid | Modifier group ID |

## Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| designation | string | Yes | Modifier name (2-255 characters) |
| priceAdjustment | number | No | Price adjustment amount (default: 0) |
| adjustmentType | string | No | Adjustment type: "fixed" or "percentage" (default: "fixed") |
| available | boolean | No | Whether modifier is available (default: true) |
| sortOrder | number | No | Sort order (default: 0) |

## Response

- **201 Created**: Modifier created successfully
- **404 Not Found**: Modifier group not found
- **422 Unprocessable Entity**: Validation error`,
      [{ key: 'id', value: '550e8400-e29b-41d4-a716-446655440000' }]
    ),

    createRequest(
      'Get Modifier',
      'GET',
      '/api/product-modifier-groups/:id/modifiers/:modifierId',
      null,
      `# Get Modifier

Retrieves a single modifier by ID.

## Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| id | uuid | Modifier group ID |
| modifierId | uuid | Modifier ID |

## Response

- **200 OK**: Returns modifier data
- **404 Not Found**: Modifier not found`,
      [
        { key: 'id', value: '550e8400-e29b-41d4-a716-446655440000' },
        { key: 'modifierId', value: '660e8400-e29b-41d4-a716-446655440000' },
      ]
    ),

    createRequest(
      'Update Modifier',
      'PUT',
      '/api/product-modifier-groups/:id/modifiers/:modifierId',
      {
        designation: 'Extra Large',
        priceAdjustment: 5.0,
        adjustmentType: 'fixed',
        available: true,
        sortOrder: 1,
      },
      `# Update Modifier

Updates an existing modifier.

## Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| id | uuid | Modifier group ID |
| modifierId | uuid | Modifier ID |

## Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| designation | string | Yes | Modifier name (2-255 characters) |
| priceAdjustment | number | No | Price adjustment amount |
| adjustmentType | string | No | Adjustment type: "fixed" or "percentage" |
| available | boolean | No | Whether modifier is available |
| sortOrder | number | No | Sort order |

## Response

- **204 No Content**: Modifier updated successfully
- **404 Not Found**: Modifier not found
- **422 Unprocessable Entity**: Validation error`,
      [
        { key: 'id', value: '550e8400-e29b-41d4-a716-446655440000' },
        { key: 'modifierId', value: '660e8400-e29b-41d4-a716-446655440000' },
      ]
    ),

    createRequest(
      'Delete Modifier',
      'DELETE',
      '/api/product-modifier-groups/:id/modifiers/:modifierId',
      null,
      `# Delete Modifier

Deletes a modifier from a modifier group.

## Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| id | uuid | Modifier group ID |
| modifierId | uuid | Modifier ID |

## Response

- **204 No Content**: Modifier deleted successfully
- **404 Not Found**: Modifier not found`,
      [
        { key: 'id', value: '550e8400-e29b-41d4-a716-446655440000' },
        { key: 'modifierId', value: '660e8400-e29b-41d4-a716-446655440000' },
      ]
    ),

    // ============================================
    // Product Integration Endpoints
    // ============================================
    createRequest(
      'List Product Modifier Groups',
      'GET',
      '/api/product/:productId/modifier-groups',
      null,
      `# List Product Modifier Groups

Retrieves all modifier groups attached to a specific product.

## Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| productId | uuid | Product ID |

## Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 10 | Items per page |
| q | string | - | Search term to filter by designation |
| sortBy | string | sortOrder | Sort field |
| sortOrder | string | asc | Sort order (asc/desc) |

## Response

- **200 OK**: Returns paginated list of modifier groups
- **404 Not Found**: Product not found`,
      [{ key: 'productId', value: '550e8400-e29b-41d4-a716-446655440000' }],
      [
        { key: 'page', value: '1', disabled: true },
        { key: 'limit', value: '10', disabled: true },
        { key: 'q', value: 'search term', disabled: true },
      ]
    ),

    createRequest(
      'Attach Modifier Group to Product',
      'POST',
      '/api/product/:productId/modifier-groups',
      {
        modifierGroupId: '770e8400-e29b-41d4-a716-446655440000',
        sortOrder: 0,
      },
      `# Attach Modifier Group to Product

Attaches a modifier group to a product, allowing customers to select modifiers when ordering.

## Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| productId | uuid | Product ID |

## Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| modifierGroupId | uuid | Yes | Modifier group ID to attach |
| sortOrder | number | No | Sort order for display (default: 0) |

## Response

- **204 No Content**: Modifier group attached successfully
- **404 Not Found**: Product or modifier group not found
- **422 Unprocessable Entity**: Validation error`,
      [{ key: 'productId', value: '550e8400-e29b-41d4-a716-446655440000' }]
    ),

    createRequest(
      'Detach Modifier Group from Product',
      'DELETE',
      '/api/product/:productId/modifier-groups',
      {
        modifierGroupId: '770e8400-e29b-41d4-a716-446655440000',
      },
      `# Detach Modifier Group from Product

Detaches a modifier group from a product.

## Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| productId | uuid | Product ID |

## Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| modifierGroupId | uuid | Yes | Modifier group ID to detach |

## Response

- **204 No Content**: Modifier group detached successfully
- **404 Not Found**: Product or modifier group not found
- **422 Unprocessable Entity**: Validation error`,
      [{ key: 'productId', value: '550e8400-e29b-41d4-a716-446655440000' }]
    ),
  ],
}

// Add the Product Modifiers folder to the collection
collection.item.push(productModifiersFolder)

// Write the updated collection back to file
fs.writeFileSync(collectionPath, JSON.stringify(collection, null, 2))

console.log('✓ Added Product Modifiers folder to Postman collection')
console.log(`✓ Added ${productModifiersFolder.item.length} endpoints`)
console.log(`✓ Collection saved to: ${collectionPath}`)
