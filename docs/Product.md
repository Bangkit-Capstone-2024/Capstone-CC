# Product API Spec

## Create Product

Endpoint : POST /api/v1/products

Request Body menggunakan form-data:

> semua key berupa `Text` kecuali pictures menggunakan `File`

```json
{
  "name_products": "Stroller Lucu",
  "description": "Example Description Product",
  "price": 100.0,
  "stock": 3,
  "is_available": true,
  "category_id": 1, // Pastikan ini sesuai dengan ID kategori yang ada
  "tenant_id": 5, // Pastikan ini sesuai dengan ID tenant yang ada
  "pictures": "https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//98/MTA-48544360/pacific_baby_stroller_bayi_pacific_spacebaby_sb-6212_-reversible_stir-_full01_k1qzxqto.jpg"
}
```

Respons Body Success :

```json
{
  "success": "true",
  "message": "Product created successfully",
  "data": {
    "id": 3,
    "name_products": "Stroller Lucu 2",
    "slug": "stroller-lucu-2",
    "pictures": "https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//98/MTA-48544360/pacific_baby_stroller_bayi_pacific_spacebaby_sb-6212_-reversible_stir-_full01_k1qzxqto.jpg",
    "description": "A high-end smartphone with 128GB storage",
    "price": 100,
    "stock": 2,
    "is_available": true,
    "created_at": "2024-05-29T16:17:36.780Z",
    "updated_at": "2024-05-29T16:17:36.780Z",
    "category_id": 1,
    "tenant_id": 5
  }
}
```

Respons Body Error :

> Akan tampil pesan error jika `tenant_id` tidak ada

```json
{
  "success": "false",
  "message": "Tenant not found!"
}
```

## Show All Product :

Endpoint : GET /api/v1/products

Respons Body :

```json
{
  "success": "true",
  "data": [
    {
      "id": 2,
      "name_products": "Stroller Lucu",
      "slug": "stroller-lucu",
      "pictures": "https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//98/MTA-48544360/pacific_baby_stroller_bayi_pacific_spacebaby_sb-6212_-reversible_stir-_full01_k1qzxqto.jpg",
      "description": "Description Products",
      "price": 100,
      "stock": 3,
      "is_available": true,
      "created_at": "2024-05-29T16:16:26.822Z",
      "updated_at": "2024-05-29T16:16:26.822Z",
      "category_id": 1,
      "tenant_id": 5,
      "category": {
        "id": 1,
        "name_categories": "Stroller",
        "created_at": "2024-05-29T16:08:18.905Z"
      },
      "tenant": {
        "id": 5,
        "user_id": 46,
        "name_tenants": "Tenant Name",
        "address_tenants": "Tenant Address",
        "created_at": "2024-05-29T09:21:54.933Z"
      }
    },
    {
      "id": 3,
      "name_products": "Stroller Lucu 2",
      "slug": "stroller-lucu-2",
      "pictures": "https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//98/MTA-48544360/pacific_baby_stroller_bayi_pacific_spacebaby_sb-6212_-reversible_stir-_full01_k1qzxqto.jpg",
      "description": "Description Products",
      "price": 100,
      "stock": 2,
      "is_available": true,
      "created_at": "2024-05-29T16:17:36.780Z",
      "updated_at": "2024-05-29T16:17:36.780Z",
      "category_id": 1,
      "tenant_id": 5,
      "category": {
        "id": 1,
        "name_categories": "Stroller",
        "created_at": "2024-05-29T16:08:18.905Z"
      },
      "tenant": {
        "id": 5,
        "user_id": 46,
        "name_tenants": "Tenant Name",
        "address_tenants": "Tenant Address",
        "created_at": "2024-05-29T09:21:54.933Z"
      }
    }
  ]
}
```

## Show Product by Id:

Endpoint : GET /api/v1/products/:id

Response Body Success :

```json
{
  "success": "true",
  "data": {
    "id": 2,
    "name_products": "Stroller Lucu",
    "slug": "stroller-lucu",
    "pictures": "https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//98/MTA-48544360/pacific_baby_stroller_bayi_pacific_spacebaby_sb-6212_-reversible_stir-_full01_k1qzxqto.jpg",
    "description": "Description Products",
    "price": 100,
    "stock": 3,
    "is_available": true,
    "created_at": "2024-05-29T16:16:26.822Z",
    "updated_at": "2024-05-29T16:16:26.822Z",
    "category_id": 1,
    "tenant_id": 5,
    "category": {
      "id": 1,
      "name_categories": "Stroller",
      "created_at": "2024-05-29T16:08:18.905Z"
    },
    "tenant": {
      "id": 5,
      "user_id": 46,
      "name_tenants": "Tenant Name",
      "address_tenants": "Tenant Address",
      "created_at": "2024-05-29T09:21:54.933Z"
    }
  }
}
```

## Update Product by Id :

Endpoint : PATCH /api/v1/products/:id

Request Body menggunakan form-data:

> semua key berupa `Text` kecuali pictures menggunakan `File`

```json
{
  "name_products": "Stroller Lucu Update",
  "description": "Example Description Product",
  "price": 100.0,
  "stock": 3,
  "is_available": true,
  "category_id": 1, // Pastikan ini sesuai dengan ID kategori yang ada
  "tenant_id": 5, // Pastikan ini sesuai dengan ID tenant yang ada
  "pictures": "https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//98/MTA-48544360/pacific_baby_stroller_bayi_pacific_spacebaby_sb-6212_-reversible_stir-_full01_k1qzxqto.jpg"
}
```

Respons Body Success :

```json
{
  "success": "true",
  "message": "Product updated successfully",
  "data": {
    "id": 2,
    "name_products": "Stroller Lucu Update",
    "slug": "stroller-lucu",
    "pictures": "https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//98/MTA-48544360/pacific_baby_stroller_bayi_pacific_spacebaby_sb-6212_-reversible_stir-_full01_k1qzxqto.jpg",
    "description": "Description Products",
    "price": 100,
    "stock": 50,
    "is_available": true,
    "created_at": "2024-05-29T16:16:26.822Z",
    "updated_at": "2024-05-29T16:46:30.338Z",
    "category_id": 1,
    "tenant_id": 5
  }
}
```

Respons Body Error :

```json
{
  "success": "false",
  "message": "Tenant not found!"
}
```

## Delete Product by Id :

Endpoint : DELETE /api/v1/products/:id

Response Body Success:

```json
{
  "success": "true",
  "message": "Product deleted successfully"
}
```

```json
{
  "success": "false",
  "message": "Product not found or already deleted!"
}
```

### Notes:

1. Nama Product harus unik atau bisa sama?
2. Jika nama product sama, bagaimana dengan slug-nya?
