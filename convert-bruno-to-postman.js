import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Postman Collection v2.1.0 schema
const postmanCollection = {
  info: {
    _postman_id: crypto.randomUUID(),
    name: 'Solar Backend API',
    description:
      'API documentation for Solar Backend - A comprehensive e-commerce and inventory management system',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  },
  variable: [
    {
      key: 'base_url',
      value: 'http://localhost:3333',
      type: 'string',
    },
    {
      key: 'access_token',
      value: '',
      type: 'string',
    },
  ],
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
  item: [],
}

// Bruno folders directory
const brunoDir = path.join(__dirname, 'bruno', 'solar-backend-api')

// Get all folders (excluding environments)
function getFolders(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true })
  return items
    .filter((item) => item.isDirectory() && item.name !== 'environments')
    .map((item) => item.name)
}

// Parse .bru file content
function parseBruFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const request = {
    meta: {},
    method: null,
    url: '',
    body: null,
    bodyType: 'none',
    auth: 'inherit',
    headers: [],
    queryParams: [],
    pathParams: [],
    tests: '',
    docs: '',
  }

  const lines = content.split('\n')
  let currentBlock = null
  let blockContent = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmedLine = line.trim()

    // Check for block starts
    if (trimmedLine.startsWith('meta {')) {
      currentBlock = 'meta'
      blockContent = []
      continue
    } else if (
      trimmedLine.startsWith('get {') ||
      trimmedLine.startsWith('post {') ||
      trimmedLine.startsWith('put {') ||
      trimmedLine.startsWith('patch {') ||
      trimmedLine.startsWith('delete {')
    ) {
      currentBlock = 'method'
      request.method = trimmedLine.split(' ')[0].toUpperCase()
      blockContent = []
      continue
    } else if (trimmedLine.startsWith('auth:bearer {')) {
      currentBlock = 'auth_bearer'
      blockContent = []
      continue
    } else if (trimmedLine.startsWith('body:json {')) {
      currentBlock = 'body_json'
      request.bodyType = 'raw'
      blockContent = []
      continue
    } else if (trimmedLine.startsWith('body:multipart-form {')) {
      currentBlock = 'body_multipart'
      request.bodyType = 'formdata'
      blockContent = []
      continue
    } else if (trimmedLine.startsWith('body:urlencoded {')) {
      currentBlock = 'body_urlencoded'
      request.bodyType = 'urlencoded'
      blockContent = []
      continue
    } else if (trimmedLine.startsWith('params:query {')) {
      currentBlock = 'params_query'
      blockContent = []
      continue
    } else if (trimmedLine.startsWith('params:path {')) {
      currentBlock = 'params_path'
      blockContent = []
      continue
    } else if (trimmedLine.startsWith('headers {')) {
      currentBlock = 'headers'
      blockContent = []
      continue
    } else if (trimmedLine.startsWith('tests {')) {
      currentBlock = 'tests'
      blockContent = []
      continue
    } else if (trimmedLine.startsWith('docs {')) {
      currentBlock = 'docs'
      blockContent = []
      continue
    } else if (trimmedLine === 'auth {') {
      currentBlock = 'auth'
      blockContent = []
      continue
    }

    // Check for block end
    if (trimmedLine === '}' && currentBlock) {
      const blockText = blockContent.join('\n')

      switch (currentBlock) {
        case 'meta':
          request.meta = parseKeyValueBlock(blockText)
          break
        case 'method':
          const methodBlock = parseKeyValueBlock(blockText)
          request.url = methodBlock.url || ''
          if (methodBlock.body) {
            request.bodyType = mapBodyType(methodBlock.body)
          }
          if (methodBlock.auth) {
            request.auth = methodBlock.auth
          }
          break
        case 'auth_bearer':
          // Token reference stored, auth handled in conversion
          break
        case 'body_json':
          request.body = parseJsonBlock(blockContent)
          break
        case 'body_multipart':
          request.body = parseMultipartBlock(blockContent)
          break
        case 'body_urlencoded':
          request.body = parseUrlencodedBlock(blockContent)
          break
        case 'params_query':
          request.queryParams = parseParamsBlock(blockContent)
          break
        case 'params_path':
          request.pathParams = parseParamsBlock(blockContent)
          break
        case 'headers':
          request.headers = parseHeadersBlock(blockContent)
          break
        case 'tests':
          request.tests = blockText
          break
        case 'docs':
          request.docs = blockText
          break
        case 'auth':
          const authModeBlock = parseKeyValueBlock(blockText)
          request.auth = authModeBlock.mode || 'inherit'
          break
      }

      currentBlock = null
      blockContent = []
      continue
    }

    // Collect block content
    if (currentBlock) {
      blockContent.push(line)
    }
  }

  return request
}

// Parse key-value block (simple format: key: value)
function parseKeyValueBlock(text) {
  const result = {}
  const lines = text.split('\n')

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    const colonIndex = trimmed.indexOf(':')
    if (colonIndex > 0) {
      const key = trimmed.substring(0, colonIndex).trim()
      const value = trimmed.substring(colonIndex + 1).trim()
      result[key] = value
    }
  }

  return result
}

// Parse JSON body block
function parseJsonBlock(lines) {
  // Remove first and last empty lines if present
  const jsonLines = lines.filter((line, index) => {
    if (index === 0 && line.trim() === '') return false
    return true
  })

  // Join and try to parse as JSON to validate
  const jsonText = jsonLines.join('\n').trim()
  return jsonText
}

// Parse multipart form block
function parseMultipartBlock(lines) {
  const formData = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    const colonIndex = trimmed.indexOf(':')
    if (colonIndex > 0) {
      let key = trimmed.substring(0, colonIndex).trim()
      let value = trimmed.substring(colonIndex + 1).trim()

      // Check if it's a file
      const fileMatch = value.match(/@file\((.+)\)/)
      if (fileMatch) {
        formData.push({
          key: key,
          value: '',
          type: 'file',
          src: fileMatch[1],
        })
      } else {
        formData.push({
          key: key,
          value: value,
          type: 'text',
        })
      }
    }
  }

  return formData
}

// Parse urlencoded block
function parseUrlencodedBlock(lines) {
  const urlencoded = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    const colonIndex = trimmed.indexOf(':')
    if (colonIndex > 0) {
      const key = trimmed.substring(0, colonIndex).trim()
      const value = trimmed.substring(colonIndex + 1).trim()

      urlencoded.push({
        key: key,
        value: value,
        type: 'text',
      })
    }
  }

  return urlencoded
}

// Parse params block (query or path)
function parseParamsBlock(lines) {
  const params = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    const colonIndex = trimmed.indexOf(':')
    if (colonIndex > 0) {
      let key = trimmed.substring(0, colonIndex).trim()
      let value = trimmed.substring(colonIndex + 1).trim()

      // Check if optional (prefixed with ~)
      const isOptional = key.startsWith('~')
      if (isOptional) {
        key = key.substring(1)
      }

      params.push({
        key: key,
        value: value,
        disabled: isOptional,
      })
    }
  }

  return params
}

// Parse headers block
function parseHeadersBlock(lines) {
  const headers = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    const colonIndex = trimmed.indexOf(':')
    if (colonIndex > 0) {
      const key = trimmed.substring(0, colonIndex).trim()
      const value = trimmed.substring(colonIndex + 1).trim()

      headers.push({
        key: key,
        value: value,
      })
    }
  }

  return headers
}

// Map Bruno body type to Postman body type
function mapBodyType(brunoType) {
  const mapping = {
    json: 'raw',
    multipartForm: 'formdata',
    urlencoded: 'urlencoded',
    none: 'none',
    graphql: 'graphql',
    text: 'raw',
    xml: 'raw',
  }

  return mapping[brunoType] || 'none'
}

// Convert Bruno request to Postman item
function convertToPostmanItem(bruRequest) {
  const item = {
    name: bruRequest.meta.name || 'Unnamed Request',
    request: {
      method: bruRequest.method,
      header: [],
      url: bruRequest.url
        ? {
            raw: bruRequest.url,
            host: ['{{base_url}}'],
            path: bruRequest.url
              .replace(/{{base_url}}\/?/, '')
              .split('/')
              .filter((p) => p),
          }
        : '',
      description: bruRequest.docs || undefined,
    },
  }

  // Handle URL with path parameters
  if (bruRequest.url && bruRequest.pathParams.length > 0) {
    item.request.url.variable = bruRequest.pathParams.map((param) => ({
      key: param.key,
      value: param.value,
    }))
  }

  // Add query parameters
  if (bruRequest.queryParams.length > 0) {
    item.request.url.query = bruRequest.queryParams.map((param) => ({
      key: param.key,
      value: param.value,
      disabled: param.disabled,
    }))
  }

  // Add headers
  if (bruRequest.headers.length > 0) {
    item.request.header = bruRequest.headers.map((h) => ({
      key: h.key,
      value: h.value,
    }))
  }

  // Add body
  if (bruRequest.bodyType !== 'none' && bruRequest.body) {
    if (bruRequest.bodyType === 'raw') {
      item.request.body = {
        mode: 'raw',
        raw: bruRequest.body,
        options: {
          raw: {
            language: 'json',
          },
        },
      }
    } else if (bruRequest.bodyType === 'formdata') {
      item.request.body = {
        mode: 'formdata',
        formdata: bruRequest.body,
      }
    } else if (bruRequest.bodyType === 'urlencoded') {
      item.request.body = {
        mode: 'urlencoded',
        urlencoded: bruRequest.body,
      }
    }
  }

  // Handle authentication
  if (bruRequest.auth === 'bearer') {
    item.request.auth = {
      type: 'bearer',
      bearer: [
        {
          key: 'token',
          value: '{{access_token}}',
          type: 'string',
        },
      ],
    }
  } else if (bruRequest.auth === 'none') {
    item.request.auth = {
      type: 'noauth',
    }
  }
  // If auth is 'inherit', don't set auth (it will inherit from collection)

  return item
}

// Process all .bru files in a folder
function processFolder(folderPath, folderName) {
  const folder = {
    name: folderName,
    item: [],
  }

  const files = fs.readdirSync(folderPath)
  const bruFiles = files.filter((file) => file.endsWith('.bru'))

  for (const file of bruFiles) {
    const filePath = path.join(folderPath, file)
    try {
      const bruRequest = parseBruFile(filePath)
      const postmanItem = convertToPostmanItem(bruRequest)
      folder.item.push(postmanItem)
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error.message)
    }
  }

  return folder
}

// Main conversion function
function convertBrunoToPostman() {
  console.log('Starting Bruno to Postman conversion...\n')

  // Get all folders
  const folders = getFolders(brunoDir)
  console.log(`Found ${folders.length} folders to process:\n`)

  // Process each folder
  for (const folderName of folders) {
    const folderPath = path.join(brunoDir, folderName)
    console.log(`Processing folder: ${folderName}`)

    const folderItem = processFolder(folderPath, folderName)

    if (folderItem.item.length > 0) {
      postmanCollection.item.push(folderItem)
    }
  }

  // Write the Postman collection to a JSON file
  const outputPath = path.join(__dirname, 'postman', 'solar-backend-api.postman_collection.json')

  // Ensure postman directory exists
  const postmanDir = path.join(__dirname, 'postman')
  if (!fs.existsSync(postmanDir)) {
    fs.mkdirSync(postmanDir, { recursive: true })
  }

  fs.writeFileSync(outputPath, JSON.stringify(postmanCollection, null, 2))

  console.log(`\n✓ Conversion complete!`)
  console.log(`✓ Postman collection saved to: ${outputPath}`)
  console.log(`\nTotal folders: ${postmanCollection.item.length}`)
  console.log(
    `Total requests: ${postmanCollection.item.reduce((acc, folder) => acc + folder.item.length, 0)}`
  )
}

// Run the conversion
convertBrunoToPostman()
