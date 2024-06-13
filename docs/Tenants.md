# Tenants API Spec

> Notes: Pada Tenants Model, `address_tenants` cukup ditulis Nama Kota, akan secara otomatis menyesuaikan berdasarkan API Google Maps

<details><summary>Create Tenant</summary>

### Endpoint : ```POST /api/v1/tenants```

> User dapat membuat lebih dari 1 tenant

Request Headers :

```
Key: Authorization
Value: Baerer <token>
```

Request Body menggunakan form-data:

> semua key berupa `Text` kecuali `image` menggunakan `File`

```json
{
  "name_tenants": "Tenant Name",
  "address_tenants": "Tenant Address",
  "image": "image-url",
  "phone": "0812345"
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
    "image": "image-url",
    "phone": "081234",
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
</details>

<details><summary>Show All Tenants</summary>

### Endpoint : ```GET /api/v1/tenants```

Request Headers :

```
Key: Authorization
Value: Baerer <token>
```

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
</details>

<details><summary>Show Tenants by Id User</summary>

### Endpoint : ```GET /api/v1/tenants/user```

> Function ini untuk menampilkan list tenant yang dimiliki oleh user berdasarkan `user_id`

Request Headers :

```
Key: Authorization
Value: Baerer <token>
```

Respons Body Success :

```json
{
    "success": "true",
    "data": [
        {
            "id": 15,
            "user_id": 5,
            "name_tenants": "Test Tenants new",
            "image": "https://storage.googleapis.com/dev-momee-products-images/tenants/Test Tenants new/images_tenant/49b7c0f54854598e15a49bc849574f51-3d-fluency-shop.png",
            "address_tenants": "Jakarta Barat, Kec. Kb. Jeruk, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, Indonesia",
            "location_lat": -6.167430899999999,
            "location_lng": 106.7637239,
            "created_at": "2024-06-12T15:32:26.109Z",
            "updated_at": "2024-06-12T15:32:26.109Z",
            "products": [],
            "totalProducts": 0
        },
        {
            "id": 16,
            "user_id": 5,
            "name_tenants": "Test Tenants new2",
            "image": "https://storage.googleapis.com/dev-momee-products-images/tenants/Test Tenants new2/images_tenant/a89d32655abcd23b1fb5c59e40c8f2cc-3d-fluency-shop.png",
            "address_tenants": "Jakarta Barat, Kec. Kb. Jeruk, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, Indonesia",
            "location_lat": -6.167430899999999,
            "location_lng": 106.7637239,
            "created_at": "2024-06-12T15:33:28.191Z",
            "updated_at": "2024-06-12T15:33:28.191Z",
            "products": [],
            "totalProducts": 0
        }
    ]
}

```

</details>

<details><summary>Show Tenants by Id Tenant</summary>

### Endpoint : ```GET /api/v1/tenants/:id```

> Function ini untuk menampilkan list tenant berdasarkan `id tenant`

Request Headers :

```
Key: Authorization
Value: Baerer <token>
```

Respons Body Success :

```json
{
  "success": "true",
  "data": {
    "id": 5,
    "user_id": 46,
    "name_tenants": "Tenant Name",
    "address_tenants": "Tenant Address",
    "created_at": "2024-05-29T09:21:54.933Z",
    "products": [
      {
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
        "tenant_id": 5,
        "category": {
          "id": 1,
          "name_categories": "Stroller",
          "created_at": "2024-05-29T16:08:18.905Z"
        }
      },
      {
        "id": 5,
        "name_products": "Stroller Lucu 23",
        "slug": "stroller-lucu-23",
        "pictures": "https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//98/MTA-48544360/pacific_baby_stroller_bayi_pacific_spacebaby_sb-6212_-reversible_stir-_full01_k1qzxqto.jpg",
        "description": "A high-end smartphone with 128GB storage",
        "price": 100000,
        "stock": 2,
        "is_available": true,
        "created_at": "2024-05-29T16:38:20.007Z",
        "updated_at": "2024-05-29T16:38:20.007Z",
        "category_id": 1,
        "tenant_id": 5,
        "category": {
          "id": 1,
          "name_categories": "Stroller",
          "created_at": "2024-05-29T16:08:18.905Z"
        }
      }
    ],
    "totalProducts": 2
  }
}
```

Respons Body Error :

```json
{
  "success": "false",
  "message": "Tenant not found"
}
```
</details>

<details><summary>Update Tenant by Id</summary>

### Endpoint : ```PATCH /api/v1/tenants/:id```

Request Headers :

```
Key: Authorization
Value: Baerer <token>
```

Request Body menggunakan form-data:

> semua key berupa `Text` kecuali `image` menggunakan `File`

```json
{
  "name_tenants": "Tenant Name",
  "address_tenants": "Tenant Address",
  "phone": "0812345",
  "image": "image-url"
}
```

Response Body Success

```json
{
  "success": "true",
  "message": "Tenant updated successfully",
  "data": {
    "id": 1,
    "user_id": 46,
    "name_tenants": "Updated Tenant Name",
    "image": "image-url",
    "phone": "081234",
    "address_tenants": "Updated Tenant Address",
    "created_at": "2024-05-29T09:20:02.361Z"
  }
}
```

Response Body Error :

```json
{
    "success": "false",
    "message": "Login first to get tokens"
}
```

</details>

<details><summary>Delete Tenant by Id</summary>

> Delete tenant hanya bisa dilakukan ketika sudah tidak memiliki product dan kategori

### Endpoint : ```DELETE /api/v1/tenants/:id```

Request Headers :

```
Key: Authorization
Value: Baerer <token>
```

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
</details>
