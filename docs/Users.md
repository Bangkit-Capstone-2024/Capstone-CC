# User API Spec

<details><summary>Register User API</summary>

### Endpoint : ```POST /api/v1/users/create```

Request Body :

> Digunakan untuk membuat user dengan email, username, password

```json
{
  "email": "roby@byamri.com",
  "username": "Roby Yasir Amri",
  "password": "password123"
}
```

Response Body Success :

> Menampilkan respons success ketika user berhasil dibuat

```json
{
  "success": "true",
  "message": "User created successfully. Please check your email to verify your account.",
  "data": {
    "id": 1,
    "email": "roby@byamri.com",
    "username": "roby"
  }
}
```

Response Body Error/Failed:

> Menampilkan respons error/failed ketika user sudah membuat akun

```json
{
  "success": "false",
  "errors": "Email already exists"
}
```

</details>

<details><summary>Verify Users via Email</summary>

> Verify email didapatkan ketika user mendaftar menggunakan email dengan benar, dan status `isVerified` akan otomatis menjadi `true` ketika verifikasi berhasil dilakukan

### Endpoint : ```GET /api/v1/users/verify-email/:id/:token```

Response Body Success :

```html
<html>
  <head>
    <title>Email Verified!</title>
  </head>

  <body>
    <h2>Hello, Roby Yasir Amri</h2>
    <h2>Your account has been successfully verified</h2>
  </body>
</html>
```

Rsponse Body Error :

```json
{
  "success": "false",
  "message": "Invalid token or user does not exist"
}
```

</details>

<details><summary>Resend Verification Users via Email</summary>


> Resend verification digunakan untuk user yang belum melakukan verifikasi email.

### Endpoint : ```GET /api/v1/users/resend-verification-email```

Request Body :

```json
{
  "email": "robyyasiramri@gmail.com"
}
```

Respons Body Success :

```json
{
  "success": "true",
  "message": "Verification email resent successfully"
}
```

Respons Body Error/Sudah Verified :

```json
{
  "success": "false",
  "message": "Email is already verified"
}
```

Respons Body Error/UserNotFound :

```json
{
  "success": "false",
  "message": "User not found"
}
```

</details>

<details><summary>Login User API</summary>

### Endpoint : ```POST /api/v1/users/login```

Request Body :

> Digunakan untuk users login menggunakan email dan password

```json
{
  "email": "roby@byamri.com",
  "password": "password123"
}
```

Response Body success :

> Menampilkan respons success ketika user berhasil login

```json
{
  "success": "true",
  "message": "Login successfully",
  "data": {
    "id": 1,
    "email": "roby@byamri.com",
    "username": "Roby Yasir Amri",
    "isVerified": true,
    "token": "unique-token"
  }
}
```

Response body error :

> Menampilkan error respons ketika email/user tidak tersedia

```json
{
  "success": "false",
  "message": "Email not found!"
}
```

</details>

<details><summary>Update User API</summary>

### Endpoint: ```PATCH /api/v1/users/update/{id}```

> Melakukan update users berdasarkan ID. Untuk memastikan user telah terupdate, bisa mengunakan `Get User List API` dan filter berdasarkan ID.

> Catatan:

1. User tidak diijinkan melakukan perubahan pada email.
2. Username tidak boleh sama dengan existing

Request Body :

```json
{
  "username": "Roby Update new",
  "password": "password1232"
}
```

Response body success :

```json
{
  "success": "true",
  "message": "User updated Successfully!",
  "data": {
    "id": 1,
    "username": "Roby Update new"
  }
}
```

Response body error :

> Menampilkan pesan error jika user id tidak ditemukan

```json
{
  "success": "false",
  "message": "User ID not found!"
}
```

> Menampilkan pesan error jika user sudah tersedia sebelumnya

```json
{
  "success": "false",
  "message": "Username already exists"
}
```

</details>

<details><summary>Get User List API</summary>

### Endpoint : ```POST /api/v1/users/read```

> Untuk menampilkan semua existing users. Kita juga bisa menggunakan filter berdasarkan id, email dan username

Response body success :

> Tidak perlu mengisi request body, akan menampilkan semua user

```json
{
  "success": "true",
  "message": "List users",
  "current_page": 1,
  "total_page": 1,
  "total_data": 5,
  "query": [
    {
      "id": 1,
      "email": "roby@byamri.com",
      "username": "Roby Yasir Amri",
      "password": "$2a$10$on1CR1/Bz/VufskYYOpS9uCT0WKSCnt79C1O6qqqWNiTALleuyOoy",
      "updated_at": "2024-05-27T03:47:59.718Z",
      "created_at": "2024-05-27T03:47:59.718Z"
    }
  ]
}
```

Request Body succes filter based:

```json
{
  "filter": {
    "id": 1
  }
}
```

Respons Body succes filter based:

```json
{
  "success": "true",
  "message": "List users",
  "current_page": 1,
  "total_page": 1,
  "total_data": 5,
  "query": [
    {
      "id": 1,
      "email": "roby@byamri.com",
      "username": "Roby Yasir Amri",
      "password": "$2a$10$on1CR1/Bz/VufskYYOpS9uCT0WKSCnt79C1O6qqqWNiTALleuyOoy",
      "updated_at": "2024-05-27T03:47:59.718Z",
      "created_at": "2024-05-27T03:47:59.718Z"
    },
    {
      "id": 2,
      "email": "roby2@byamri.com",
      "username": "Roby Yasir Amri",
      "password": "$2a$10$on1CR1/Bz/VufskYYOpS9uCT0WKSCnt79C1O6qqqWNiTALleuyOoy",
      "updated_at": "2024-05-27T03:47:59.718Z",
      "created_at": "2024-05-27T03:47:59.718Z"
    }
  ]
}
```

Response body error :

```json
{
  "errors": "Unautorized"
}
```

</details>

<details><summary>Logout User API</summary>


### Endpoint : ```POST /api/v1/users/logout```

Reponse body Success :

```json
{
    "success": "true",
    "message": "Logout successfully"
}
```

Response Body Error :

```json
{
  "success": "false",
  "message": "User id not found"
}
```

</details>


<details><summary>User Request Reset Password</summary>


### Endpoint : ```POST /api/v1/users/request-password-reset```

> Ini digunakan untuk user melakukan request password, dan token akan dikirim via email dan valid selama 1 jam

Request Body :

```json
{
  "email": "robyyasiramri@gmail.com"
}
```

Response Body Success:

```json
{
  "success": "true",
  "message": "Email sent to robyyasiramri@gmail.com with further instructions"
}
```

Response Body Error:

```json
{
  "success": "false",
  "message": "User with this email does not exist"
}
```

</details>

<details><summary>Reset Password</summary>


### Endpoint : ```POST /api/v1/users/reset/:token```

> Setelah melakukan request password, akan mendapatkan link berisi token

Request Body :

```json
{
  "password": "new-password"
}
```

Respons Body Success :

```json
{
  "success": "true",
  "message": "Password has been reset successfully"
}
```

Response Body Error :

```json
{
  "success": "false",
  "message": "Password reset token is invalid or has expired"
}
```

</details>
