# Product API Spec

<details><summary>Create Product</summary>

### Endpoint : ```POST /api/v1/products```

Request Headers :

```
Key: Authorization
Value: Baerer <token>
```

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

</details>

<details><summary>Show All Product</summary>

### Endpoint : ```GET /api/v1/products```

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
</details>

<details><summary>Search Product by Name</summary>

### Endpoint : ```GET /api/v1/products/search?name={name_products}```

Response Body Success :

```json
{
  "success": "true",
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": 18,
      "name_products": "Baby Car Seat",
      "slug": "baby-car-seat-ca246647",
      "pictures": "[]",
      "description": "Example Description Product",
      "price": 8500,
      "stock": 2,
      "is_available": true,
      "created_at": "2024-05-31T03:18:56.828Z",
      "updated_at": "2024-05-31T03:18:56.828Z",
      "category_id": 3,
      "tenant_id": 10,
      "category": {
        "id": 3,
        "name_categories": "Baby Car Seat",
        "created_at": "2024-05-29T16:11:37.213Z"
      },
      "tenant": {
        "id": 10,
        "user_id": 45,
        "name_tenants": "Roby Stores",
        "address_tenants": "Jakarta Barat",
        "created_at": "2024-05-30T08:00:52.209Z"
      }
    },
    {
      "id": 19,
      "name_products": "Baby Car Seat 1",
      "slug": "baby-car-seat-1-06f91f5f",
      "pictures": "[]",
      "description": "Example Description Product",
      "price": 8500,
      "stock": 2,
      "is_available": true,
      "created_at": "2024-05-31T03:19:05.813Z",
      "updated_at": "2024-05-31T03:19:05.813Z",
      "category_id": 3,
      "tenant_id": 10,
      "category": {
        "id": 3,
        "name_categories": "Baby Car Seat",
        "created_at": "2024-05-29T16:11:37.213Z"
      },
      "tenant": {
        "id": 10,
        "user_id": 45,
        "name_tenants": "Roby Stores",
        "address_tenants": "Jakarta Barat",
        "created_at": "2024-05-30T08:00:52.209Z"
      }
    }
  ]
}
```

Response Body Error :

```json
{
  "success": "false",
  "message": "No products found with the given name"
}
```
</details>

<details><summary>Search Product by Image</summary>

### Endpoint : ``` POST /api/v1/products/search-by-image```

Response Body Success :

```json
{
    "success": "true",
    "message": "Products retrieved successfully",
    "data": [
        {
            "id": 5,
            "name_products": "Baby Bed",
            "slug": "baby-bed-9cb5ef7d",
            "pictures": "[\"https://storage.googleapis.com/dev-momee-products-images/Roby Stores Update/4aed844293c0f78b9ac80c350386562b-Delicate-Wooden-Style-Baby-Bed-Baby-Cot-Design-Simple-and-Elegant-Baby-Swing-and-Bassinet.webp\"]",
            "description": "Example Description Product",
            "price": 10500,
            "stock": 2,
            "is_available": true,
            "created_at": "2024-06-04T04:03:56.758Z",
            "updated_at": "2024-06-04T04:03:56.758Z",
            "category_id": 4,
            "tenant_id": 1
        }
    ]
}
```

Response Body Error :

```json

{
    "success": "false",
    "message": "No products found for the given image"
}
```
</details>


<details><summary>Show Product by Id</summary>

### Endpoint : ```GET /api/v1/products/:id```

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
</details>

<details><summary>Update Product by Id</summary>

### Endpoint : ```PATCH /api/v1/products/:id```

Request Headers :

```
Key: Authorization
Value: Baerer <token>
```

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
</details>

<details><summary>Delete Product by Id</summary>

### Endpoint : ```DELETE /api/v1/products/:id```

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
</details>


