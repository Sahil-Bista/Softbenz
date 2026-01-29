# Blog-management-API

A simple blog management backend that allows authors to perform CRUD operation on blogs and allows usersto view and download them for offline reading.

## Run Locally

Clone the project

```bash
  git clone https://github.com/Sahil-Bista/Softbenz.git
```

Go to the project directory

```bash
  cd Softbenz
```

Install dependencies

```bash
  npm install
```

Set up the .env

```bash
  Add your credentials for MONGO_URI, ACCESS_TOKEN_SECRET and PORT
```

Start the server

```bash
  node index.js
```

## API USAGE:

Base URLs:

- API: `http://localhost:3000/api`
- Users: `http://localhost:3000/api/user`
- Blogs: `http://localhost:3000/api/blog`

## Authentication

All endpoints require JWT tokens except `/register` and `/login`.

### 1. Register a User

**POST** `/register`

**Body:**
{
"email": "5@example.com",
"password": "securepassword123",
"firstname":"Sahil",
"lastname" :"BIsta"
}

**Response:**
{
"msg": "New user regsitered successfully",
"data": {
"email": "5@gmail.com",
"password": "$2b$10$qr/OUimn92iTG5qtLMvwsecjsZxefNVR/k8kya7OAbxTHeHShjrk6",
"firstName": "Sahil",
"lastName": "Bista",
"role": "Author",
"\_id": "697b258ab81cd0698cccdbe6",
"\_\_v": 0
}
}

---

### 2. Login

**POST** `/login`

**Body:**
{
"email": "john@example.com",
"password": "securepassword123"
}

**Response:**
{
"access_token": "JWT_TOKEN_HERE"
}

> Use this `token` in the `Authorization` header for all protected routes:  
> `Authorization: Bearer JWT_TOKEN_HERE`

---

## Blog Endpoints

All blog endpoints require a valid JWT.

### Create a Blog (Author only)

**POST** `/blog/create`

**Headers:** Authorization: Bearer JWT_TOKEN_HERE, Content-Type: application/json

**Body:**
{
"title": "My First Blog",
"content": "This is my first blog post content...",
"allowDownload": true
}

**Response:**
{
"authorId": "697a23e325ae4470be37571d",
"title": "My First Blog",
"content": "This is my first blog post content...",
"status": "Unpublished",
"slug": "annapurna-base-camp-1",
"allowDownload": true,
"\_id": "697b2603b81cd0698cccdbed",
"createdAt": "2026-01-29T09:18:59.777Z",
"updatedAt": "2026-01-29T09:18:59.777Z",
"\_\_v": 0
}

### Publish a Blog (Author only)

**POST** `/publish/:slug`

**Headers:** Authorization: Bearer JWT_TOKEN_HERE

{
"msg": "post published",
"data": {
"\_id": "697b2603b81cd0698cccdbed",
"authorId": "697a23e325ae4470be37571d",
"title": "annapurna-base-camp",
"content": "Amazing wowwww",
"status": "Published",
"slug": "annapurna-base-camp-1",
"allowDownload": false,
"createdAt": "2026-01-29T09:18:59.777Z",
"updatedAt": "2026-01-29T09:20:05.907Z",
"\_\_v": 0
}
}

### Archive a Blog (Author only)

**POST** `/archive/:slug`

**Headers:** Authorization: Bearer JWT_TOKEN_HERE

**Response:**
{
"msg": "post published",
"data": {
"\_id": "697b2603b81cd0698cccdbed",
"authorId": "697a23e325ae4470be37571d",
"title": "annapurna-base-camp",
"content": "Amazing wowwww",
"status": "Unpublished",
"slug": "annapurna-base-camp-1",
"allowDownload": false,
"createdAt": "2026-01-29T09:18:59.777Z",
"updatedAt": "2026-01-29T09:20:05.907Z",
"\_\_v": 0
}
}

### Get All Published Blogs (Author & User)

**GET** `/blog?page=1&limit=10&search=everes`

Headers: Authorization: Bearer JWT_TOKEN_HERE

**Response:**
{
"msg": "blogs retrieved",
"meta": {
"totalBlogs": 3,
"totalPages": 1,
"currentPage": 1,
"pageSize": 6
},
"data": [
{
"_id": "697a2c2c02bd0a9eadda5b58",
"authorId": "697a23e325ae4470be37571d",
"title": "Everes-base-camp",
"content": "Amazing trek, lovely trek",
"status": "Published",
"slug": "everes-base-camp-2",
"createdAt": "2026-01-28T15:33:00.603Z",
"updatedAt": "2026-01-28T15:33:38.608Z",
"__v": 0
},
{
"_id": "697a2c3702bd0a9eadda5b67",
"authorId": "697a23e325ae4470be37571d",
"title": "Everes-base-camp",
"content": "Amazing trek",
"status": "Published",
"slug": "everes-base-camp-4",
"createdAt": "2026-01-28T15:33:11.165Z",
"updatedAt": "2026-01-28T15:33:44.093Z",
"__v": 0
},
{
"_id": "697a2c3f02bd0a9eadda5b70",
"authorId": "697a23e325ae4470be37571d",
"title": "Everes-base-camp",
"content": "Amazing wowwww",
"status": "Published",
"slug": "everes-base-camp-5",
"createdAt": "2026-01-28T15:33:19.953Z",
"updatedAt": "2026-01-28T15:33:45.275Z",
"__v": 0
}
]
}

### Get Author's Blogs (Author only)

**GET** `/blog/myBlogs`

Headers: Authorization: Bearer JWT_TOKEN_HERE

**Response:**
{
"msg": "blog found",
"data": [
{
"_id": "697a26871a6117ca94c95e50",
"authorId": "697a23e325ae4470be37571d",
"title": "Everes-base-camp",
"content": "Amazing trek, lovely trek , best trek",
"status": "Unpublished",
"slug": "everes-base-camp",
"createdAt": "2026-01-28T15:08:55.219Z",
"updatedAt": "2026-01-28T15:08:55.219Z",
"__v": 0
},
{
"_id": "697a2c2c02bd0a9eadda5b58",
"authorId": "697a23e325ae4470be37571d",
"title": "Everes-base-camp",
"content": "Amazing trek, lovely trek",
"status": "Published",
"slug": "everes-base-camp-2",
"createdAt": "2026-01-28T15:33:00.603Z",
"updatedAt": "2026-01-28T15:33:38.608Z",
"__v": 0
},
{
"_id": "697a2c3202bd0a9eadda5b5f",
"authorId": "697a23e325ae4470be37571d",
"title": "wow",
"content": "lovely asaasas",
"status": "Published",
"slug": "everes-base-camp-3",
"createdAt": "2026-01-28T15:33:06.677Z",
"updatedAt": "2026-01-28T15:41:46.736Z",
"__v": 0
},
{
"_id": "697a2c3702bd0a9eadda5b67",
"authorId": "697a23e325ae4470be37571d",
"title": "Everes-base-camp",
"content": "Amazing trek",
"status": "Published",
"slug": "everes-base-camp-4",
"createdAt": "2026-01-28T15:33:11.165Z",
"updatedAt": "2026-01-28T15:33:44.093Z",
"__v": 0
},
{
"_id": "697a2c3f02bd0a9eadda5b70",
"authorId": "697a23e325ae4470be37571d",
"title": "Everes-base-camp",
"content": "Amazing wowwww",
"status": "Published",
"slug": "everes-base-camp-5",
"createdAt": "2026-01-28T15:33:19.953Z",
"updatedAt": "2026-01-28T15:33:45.275Z",
"__v": 0
},
{
"_id": "697b2603b81cd0698cccdbed",
"authorId": "697a23e325ae4470be37571d",
"title": "annapurna-base-camp",
"content": "Amazing wowwww",
"status": "Published",
"slug": "annapurna-base-camp-1",
"allowDownload": false,
"createdAt": "2026-01-29T09:18:59.777Z",
"updatedAt": "2026-01-29T09:20:05.907Z",
"__v": 0
}
]
}

### Get a Single Blog (Author & User)

**GET** `/blog/:slug`

Headers: Authorization: Bearer JWT_TOKEN_HERE

**Response:**
{
"\_id": "697b2603b81cd0698cccdbed",
"authorId": "697a23e325ae4470be37571d",
"title": "annapurna-base-camp",
"content": "Amazing wowwww",
"status": "Published",
"slug": "annapurna-base-camp-1",
"allowDownload": false,
"createdAt": "2026-01-29T09:18:59.777Z",
"updatedAt": "2026-01-29T09:20:05.907Z",
"\_\_v": 0
}

### Edit a Blog (Author only)

**PATCH** `/blog/edit/:slug`

Headers: Authorization: Bearer JWT_TOKEN_HERE, Content-Type: application/json

**Body:**
{
"title": "Updated Blog Title",
"content": "Updated content",
}

**Response:**
{
"\_id": "697b2603b81cd0698cccdbed",
"authorId": "697a23e325ae4470be37571d",
"title": "Updated Blog Title,
"content": "Updated content",
"status": "Published",
"slug": "annapurna-base-camp-1",
"allowDownload": false,
"createdAt": "2026-01-29T09:18:59.777Z",
"updatedAt": "2026-01-29T09:20:05.907Z",
"\_\_v": 0
}

### Delete a Blog (Author only)

**DELETE** `/blog/:slug`

Headers: Authorization: Bearer JWT_TOKEN_HERE

**Response:**
{
"msg": "blog deleted ",
"data":{
"\_id": "697b2603b81cd0698cccdbed",
"authorId": "697a23e325ae4470be37571d",
"title": "Updated Blog Title,
"content": "Updated content",
"status": "Published",
"slug": "annapurna-base-camp-1",
"allowDownload": false,
"createdAt": "2026-01-29T09:18:59.777Z",
"updatedAt": "2026-01-29T09:20:05.907Z",
"\_\_v": 0
}
}

### Toggle Downloadability (Author only)

**POST** `/blog/toggleDowloadability/:slug`

Headers: Authorization: Bearer JWT_TOKEN_HERE

**Response:**
{
"msg": "post downloadability changed",
"data":{
"\_id": "697b2603b81cd0698cccdbed",
"authorId": "697a23e325ae4470be37571d",
"title": "Updated Blog Title,
"content": "Updated content",
"status": "Published",
"slug": "annapurna-base-camp-1",
"allowDownload": false,
"createdAt": "2026-01-29T09:18:59.777Z",
"updatedAt": "2026-01-29T09:20:05.907Z",
"\_\_v": 0
}
}

### Download Blog PDF (Author & User)

**GET** `/blog/download/:slug`

Headers: Authorization: Bearer JWT_TOKEN_HERE

- Downloads the blog as a PDF if `allowDownload` is true
- Returns 403 Forbidden if downloads are disabled

---

### Notes

- All endpoints are JWT-protected
- Author role can create, edit, publish, archive, delete, toggle downloads
- User role can view and download published blogs
- Pagination and search are optional in GET /blog
