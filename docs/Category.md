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
</details>
