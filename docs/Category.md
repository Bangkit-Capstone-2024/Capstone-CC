# Category API Spec

<details><summary>Create New Category</summary>

### Endpoint : ```POST /api/v1/categories```

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

Request Body :

```json
{
  "name_categories": "new_category_name_update"
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
