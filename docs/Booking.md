# Booking API Spec

> User dapat melakukan booking sesuai dengan stock barang yang tersedia

<details><summary>Create New Booking</summary>

> Ketika membuat booking baru, harga akan otomatis menyesuaikan/menjumlahkan sesuai dengan `startDate` dan `endDate` dari user.

### Endpoint : ```POST /api/v1/bookings```

Request Headers :

```
Key: Authorization
Value: Baerer <token>
```

Request Body :

```JSON
{
    "product_id" : "1",
    "startDate" : "2024-06-10",
    "endDate" : "2024-06-16"
}

```
Response Body Success :

```json

{
    "success": "true",
    "message": "Booking created successfully",
    "data": {
        "id": 5,
        "startDate": "2024-06-10T00:00:00.000Z",
        "endDate": "2024-06-16T00:00:00.000Z",
        "totalPrice": 51000,
        "user_id": 1,
        "product_id": 1,
        "created_at": "2024-06-09T14:46:43.688Z",
        "updated_at": "2024-06-09T14:46:43.688Z"
    }
}
```

Response Body Error :

> Jika product id tidak ada

```json

{
    "success": "false",
    "message": "Product not available"
}

```

> Jika stock product habis

```json
{
    "success": "false",
    "message": "Product is out of stock"
}

```

</details>

<details><summary>Get Booking by User</summary>

> 

### Endpoint : ```GET /api/v1/bookings```

Request Headers :

```
Key: Authorization
Value: Baerer <token>
```

Response Body Success :

```json

{
    "success": "true",
    "data": [
        {
            "id": 4,
            "startDate": "2024-06-10T00:00:00.000Z",
            "endDate": "2024-06-16T00:00:00.000Z",
            "totalPrice": 51000,
            "user_id": 1,
            "product_id": 1,
            "created_at": "2024-06-08T18:09:04.690Z",
            "updated_at": "2024-06-08T18:09:04.690Z",
            "product": {
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
                "address_tenants": "Kota Semarang, Jawa Tengah, Indonesia",
                "tenant": {
                    "id": 2,
                    "user_id": 1,
                    "name_tenants": "Roby Stores Update 2",
                    "address_tenants": "Kota Semarang, Jawa Tengah, Indonesia"
                }
            }
        },
    ]
}
```

</details>


<details><summary>Get Booking by Id</summary>

> 

### Endpoint : ```GET /api/v1/bookings/:id```

Request Headers :

```
Key: Authorization
Value: Baerer <token>
```

Response Body Success :


```json

{
    "success": "true",
    "data": {
        "id": 4,
        "startDate": "2024-06-10T00:00:00.000Z",
        "endDate": "2024-06-16T00:00:00.000Z",
        "totalPrice": 51000,
        "user_id": 1,
        "product_id": 1,
        "created_at": "2024-06-08T18:09:04.690Z",
        "updated_at": "2024-06-08T18:09:04.690Z",
        "product": {
            "id": 1,
            "name_products": "Ride On 2 test",
            "slug": "ride-on-2-test-846c3f67",
            "pictures": "[\"https://storage.googleapis.com/dev-momee-products-images/Roby Stores Update 2/0c969e2d9b5cd968c62705264c94ba0c-ride-on.jpg\"]",
            "description": "Example Description Product",
            "price": 8500,
            "stock": 7,
            "is_available": true,
            "created_at": "2024-06-07T18:56:16.669Z",
            "updated_at": "2024-06-09T14:56:55.654Z",
            "category_id": 1,
            "tenant_id": 2,
            "address_tenants": "Kota Semarang, Jawa Tengah, Indonesia"
        },
        "user": {
            "id": 1,
            "email": "robyyasiramri@gmail.com",
            "username": "Roby Yasir"
        }
    }
}
```

Response Body Error :

```json
{
    "success": "false",
    "message": "Booking not found"
}
```

</details>

<details><summary>Delete/Cancel Booking</summary>

> 

### Endpoint : ```DELETE /api/v1/bookings```

Request Headers :

```
Key: Authorization
Value: Baerer <token>
```

Response Body Success :

```json

{
    "success": "true",
    "message": "Booking canceled successfully"
}
```

Response Body Error :

```json
{
    "success": "false",
    "message": "Booking not found or already canceled!"
}
```

</details>
