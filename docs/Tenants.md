# Tenants API Spec

## Create Tenant

Endpoint : POST /api/v1/tenants

> Setiap User hanya diijinkan untuk membuat 1 tenant

Request Body :

```json
{
  "user_id": 1,
  "name_tenants": "Tenant Name",
  "address_tenants": "Tenant Address"
}
```

Response Body Success :

```json
{
  "success": "true",
  "message": "Tenant created successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "name_tenants": "Tenant Name",
    "address_tenants": "Tenant Address",
    "created_at": "2024-05-29T09:27:59.169Z"
  }
}
```

Respons Body Error (user_id not found):

```json
{
  "success": "false",
  "message": "User ID not found!"
}
```

Respons Body Error (Jika user sudah mempunyai tenant):

```json
{
  "success": "false",
  "message": "User already has a tenant"
}
```

## Show All Tenants

Endpoint : GET /api/v1/tenants

Respons Body Success :

```json
{
  "success": "true",
  "data": [
    {
      "id": 1,
      "user_id": 46,
      "name_tenants": "Tenant Name",
      "address_tenants": "Tenant Address",
      "created_at": "2024-05-29T09:20:02.361Z"
    }
  ]
}
```

## Show Tenants by Id

Endpoint : GET /api/v1/tenants/:id

Respons Body Success :

```json
{
  "success": "true",
  "data": [
    {
      "id": 1,
      "user_id": 46,
      "name_tenants": "Tenant Name",
      "address_tenants": "Tenant Address",
      "created_at": "2024-05-29T09:20:02.361Z"
    }
  ]
}
```

Respons Body Error :

```json
{
  "success": "false",
  "message": "Tenant not found"
}
```

## Update Tenant by Id

Endpoint : PATCH /api/v1/tenants/:id

Request Body :

```json
{
  "name_tenants": "Updated Tenant Name",
  "address_tenants": "Updated Tenant Address"
}
```

Response Budy Success

```json
{
  "success": "true",
  "message": "Tenant updated successfully",
  "data": {
    "id": 1,
    "user_id": 46,
    "name_tenants": "Updated Tenant Name",
    "address_tenants": "Updated Tenant Address",
    "created_at": "2024-05-29T09:20:02.361Z"
  }
}
```

## Delete Tenant by Id

Endpoint : DELETE /api/v1/tenants/:id

Response Body Success

```json
{
  "success": "true",
  "message": "Tenant deleted successfully"
}
```

Response Body Error :

```json
{
  "success": "false",
  "message": "Tenant not found or already deleted!"
}
```
