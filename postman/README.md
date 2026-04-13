# Solar Backend API - Postman Collection

This directory contains the Postman Collection v2.1.0 format files converted from Bruno API documentation.

## Files

| File | Description |
|------|-------------|
| `solar-backend-api.postman_collection.json` | Main Postman collection with all API endpoints |
| `local_dev.postman_environment.json` | Environment for local development (localhost:3333) |
| `stage.postman_environment.json` | Environment for staging/production server |

## Collection Overview

The collection contains **77 API endpoints** organized into **12 folders**:

| Folder | Description | Endpoints |
|--------|-------------|-----------|
| Authentication | Login, logout, and user session management | 4 |
| Customers | Customer CRUD operations and address management | 7 |
| Image Media | Image upload and deletion | 2 |
| Market Services | Service listing and management | 6 |
| Orders | Order creation, retrieval, and status management | 7 |
| Product Categories | Category management and product listing | 5 |
| Product Modifiers | Modifier groups, individual modifiers, and product integration | 13 |
| Product Packs | Product pack management and stock operations | 8 |
| Products | Product CRUD and image management | 9 |
| Staff Members | Staff member management | 5 |
| Stock | Stock management and history | 6 |
| Store | Store management | 4 |

## Variables

The collection uses the following variables:

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `base_url` | API base URL | `http://localhost:3333` |
| `access_token` | Bearer token for authentication | (empty) |

## Importing into Postman

### Import the Collection

1. Open Postman
2. Click **Import** button (top left)
3. Drag and drop `solar-backend-api.postman_collection.json` or click **Upload Files**
4. Click **Import**

### Import an Environment

1. Click the gear icon ⚙️ in the top right (Manage Environments)
2. Click **Import**
3. Drag and drop the environment file or click **Upload Files**
4. Select `local_dev.postman_environment.json` or `stage.postman_environment.json`
5. Click **Import**

## Usage

### 1. Set Up Authentication

1. Use the **Login** request in the Authentication folder
2. Send the request with valid credentials
3. The response will contain an `accessToken`
4. Copy the token value
5. Update the `access_token` variable in your environment

Alternatively, you can set up auto-population of the token using Postman scripts:

```javascript
// Add this to the Tests tab of your Login request
var jsonData = pm.response.json();
pm.environment.set("access_token", jsonData.data.accessToken);
```

### 2. Switch Environments

Use the environment dropdown in the top right to switch between:
- **Local Development** - For local testing (http://localhost:3333)
- **Stage** - For staging/production (https://solar-sys-api-production.up.railway.app)

### 3. Making Requests

Most endpoints require authentication. Ensure your `access_token` is set before making requests.

- Requests with **noauth** (like Login, Register) don't require a token
- All other requests inherit bearer token authentication from the collection

## Authentication

The collection uses **Bearer Token** authentication. The token is automatically included in the `Authorization` header for all requests that require authentication.

### Endpoints Without Authentication

- `POST /api/login` - Login
- `POST /api/register` - Register new user

### Endpoints Requiring Authentication

All other endpoints require a valid bearer token.

## Request Types

The collection includes various request types:

### JSON Body Requests
Most POST, PUT, and PATCH requests use JSON bodies with example data pre-filled.

### Query Parameters
Endpoints with filtering/pagination support include query parameters:
- Parameters marked as **disabled** are optional
- Enable them by clicking the checkbox next to the parameter

### Path Parameters
URLs with `:id` placeholders use Postman path parameters:
- Example: `/api/customers/:id`
- Replace the placeholder value before sending

### Multipart Form Data
Image upload endpoints use `multipart/form-data`:
- File paths may need to be updated to point to local files
- Click the file input field to select a new file

## Notes

1. **Access Tokens**: The tokens in the environment files may be expired. Obtain a fresh token using the Login endpoint.

2. **File Uploads**: Multipart form data endpoints reference absolute file paths. Update these to point to files on your machine.

3. **Path Parameters**: Some endpoints have placeholder UUID values. Replace these with actual IDs from your database.

4. **Documentation**: Each request includes description documentation from the original Bruno files with request/response details.

5. **Tests**: The original Bruno test scripts were not converted. You can add Postman tests manually in the Tests tab.

## API Base URLs

| Environment | URL |
|-------------|-----|
| Local Development | `http://localhost:3333` |
| Staging/Production | `https://solar-sys-api-production.up.railway.app` |

## Troubleshooting

### 401 Unauthorized
- Verify your `access_token` is valid
- Get a new token using the Login endpoint

### 404 Not Found
- Check that the `base_url` is correct
- Verify the resource ID exists

### 422 Validation Error
- Check the request body matches the expected format
- Review the request documentation for required fields

## Conversion Details

This collection was converted from Bruno API documentation using a custom Node.js conversion script.

**Conversion Date**: April 2025  
**Source Format**: Bruno (.bru files)  
**Target Format**: Postman Collection v2.1.0

---

For more information about the API, refer to the main project README.