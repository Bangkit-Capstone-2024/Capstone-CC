# Category API Spec

<details><summary>Create New Category</summary>

### Endpoint : ```POST /api/v1/categories```

Request Headers :

```
Key: Authorization
Value: Baerer <token>
```

Request Body :

```json
{
  "name_categories": "Stroller"
}
```

Response Body :

```json
{
  "success": "true",
  "message": "Category created successfully",
  "data": {
    "id": 1,
    "name_categories": "Stroller",
    "created_at": "2024-05-29T16:08:18.905Z"
  }
}
```
</details>

<details><summary>Show All Categories</summary>


### Endpoint : ```GET /api/v1/categories```

Request Headers :

```
Key: Authorization
Value: Baerer <token>
```

Response Body :

```json
{
  "success": "true",
  "data": [
    {
      "id": 1,
      "name_categories": "Stroller",
      "created_at": "2024-05-29T16:08:18.905Z"
    },
    {
      "id": 2,
      "name_categories": "Walkers",
      "created_at": "2024-05-29T16:11:23.703Z"
    },
    {
      "id": 3,
      "name_categories": "Baby Car Seat",
      "created_at": "2024-05-29T16:11:37.213Z"
    }
  ]
}
```
</details>

<details><summary>Delete Category by Id</summary>

### Endpoint : ```DELETE /api/v1/categories/:id```

Request Headers :

```
Key: Authorization
Value: Baerer <token>
```

Response Body Success :

```json
{
  "success": "true",
  "message": "Category deleted successfully"
}
```

Response Body Error :

```json
{
  "success": "false",
  "message": "Category not found or already deleted!"
}
```

Response Body Error jika masih ada product:

```json
{
    "success": "false",
    "message": "Category contains products and cannot be deleted!"
}
```
</details>

<details><summary>Update Category by Id</summary>

### Endpoint : ```PATCH /api/v1/categories/:id```

Request Headers :

```
Key: Authorization
Value: Baerer <token>
```

Request Body menggunakan form-data:

> semua key berupa `Text` kecuali avatar menggunakan `File`


```json
{
  "name_categories": "new_category_name_update",
  "image": "url"
}


```
Response Body Success :

```json

{
    "success": "true",
    "message": "Category updated successfully",
    "data": {
        "id": 6,
        "name_categories": "Breast Pump Updated",
        "created_at": "2024-06-04T12:31:02.334Z"
    }
}
```
</details>

<details><summary>Show Category by Id</summary>

### Endpoint : ```GET /api/v1/categories/:id```
Request Headers :

```
Key: Authorization
Value: Baerer <token>
```
Response Body Success :

```json
{
    "success": "true",
    "message": "Category retrieved successfully",
    "data": {
        "id": 1,
        "name_categories": "Test Category Jakarta",
        "image": null,
        "created_at": "2024-06-07T18:55:10.265Z",
        "products": [
            {
                "id": 1,
                "name_products": "Ride On 2 test",
                "slug": "ride-on-2-test-846c3f67",
                "pictures": "[\"https://storage.googleapis.com/dev-momee-products-images/Roby Stores Update 2/0c969e2d9b5cd968c62705264c94ba0c-ride-on.jpg\"]",
                "description": "Example Description Product",
                "price": 8500,
                "stock": 8,
                "is_available": true,
                "created_at": "2024-06-07T18:56:16.669Z",
                "updated_at": "2024-06-09T15:26:05.455Z",
                "category_id": 1,
                "tenant_id": 2,
                "address_tenants": "Kota Semarang, Jawa Tengah, Indonesia"
            },
            {
                "id": 3,
                "name_products": "Baby Bed",
                "slug": "baby-bed-b0ea97ce",
                "pictures": "[]",
                "description": "Example Description Product",
                "price": 8500,
                "stock": 0,
                "is_available": true,
                "created_at": "2024-06-09T15:11:54.790Z",
                "updated_at": "2024-06-09T15:12:28.806Z",
                "category_id": 1,
                "tenant_id": 2,
                "address_tenants": "Kota Semarang, Jawa Tengah, Indonesia"
            },
            {
                "id": 4,
                "name_products": "Baby Bed",
                "slug": "baby-bed-0fbb399d",
                "pictures": "[]",
                "description": "Example Description Product",
                "price": 8500,
                "stock": 1,
                "is_available": true,
                "created_at": "2024-06-09T15:25:30.954Z",
                "updated_at": "2024-06-09T15:25:30.954Z",
                "category_id": 1,
                "tenant_id": 2,
                "address_tenants": "Kota Semarang, Jawa Tengah, Indonesia"
            },
            {
                "id": 5,
                "name_products": "Baby Bed",
                "slug": "baby-bed-bef47373",
                "pictures": "[]",
                "description": "Example Description Product",
                "price": 8500,
                "stock": 1,
                "is_available": true,
                "created_at": "2024-06-09T15:28:51.977Z",
                "updated_at": "2024-06-09T15:45:01.039Z",
                "category_id": 1,
                "tenant_id": 2,
                "address_tenants": "Kota Semarang, Jawa Tengah, Indonesia"
            },
            {
                "id": 6,
                "name_products": "Baby Bed",
                "slug": "baby-bed-0d2e9530",
                "pictures": "[]",
                "description": "Example Description Product",
                "price": 8500,
                "stock": 3,
                "is_available": true,
                "created_at": "2024-06-11T02:56:07.861Z",
                "updated_at": "2024-06-11T02:56:07.861Z",
                "category_id": 1,
                "tenant_id": 2,
                "address_tenants": "Kota Semarang, Jawa Tengah, Indonesia"
            }
        ],
        "amount": 5
    }
}
```

Response Body Error :

```json
{
    "success": "false",
    "message": "Category not found!"
}
```

</details>
