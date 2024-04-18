
# Project API Documentation

## Overview

This documentation provides detailed information on the backend API endpoints for a wedding organization website. It outlines the functionalities for managing users, products, carts, and profiles, essential for the platform's operation.

## Base URL

`http://localhost:3000`

## Authentication

Most endpoints require authentication. Ensure to include a valid authentication token in the request header.

## Endpoints

## User Management Endpoints

### Register User

Allows new users to register on the platform.

- **URL**: `/register`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  - `name` (required): User's full name.
  - `username` (required): User's chosen username.
  - `email` (required): User's email address.
  - `password` (required): User's chosen password.

#### Success Response:

- **Code**: `201 Created`
- **Content**:

```json
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "hashed_password"
}
```

#### Error Response:

- **Code**: `400 Bad Request`
- **Content**:

```json
{
  "message": "Required field is missing"
}
```

### Login User

Allows existing users to log in.

- **URL**: `/login`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  - `email` (required): User's email address.
  - `password` (required): User's password.

#### Success Response:

- **Code**: `200 OK`
- **Content**:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Error Response:

- **Code**: `400 Bad Request`
- **Content**:

```json
{
  "message": "email/password is required"
}
```

### Google Login

Allows users to log in using their Google account. If the user does not exist in the database, a new user record will be created.

- **URL**: `/google-login`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  - `tokenGoogle` (required): The Google ID token obtained from the client-side Google Sign-In process.

#### Success Response:

- **Code**: `201 Created`
- **Content**:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Error Response:

- **Code**: `400 Bad Request`
- **Content**:

```json
{
  "message": "Invalid Google ID token"
}
```

#### Notes:

- The `tokenGoogle` must be obtained on the client side using Google's OAuth 2.0 authentication services.
- The `clientId` used in the server-side verification should match the one used to obtain the `tokenGoogle` on the client side. This ensures that the token is valid and is actually coming from your Google Client ID.
- This endpoint will create a new user if the email obtained from the Google ID token does not match any existing users in the database, leveraging the `FindOrCreate` method in the `User` model.


### Product Management

#### Add Product

- **URL**: `/createproduct`
- **Method**: `POST`
- **Auth Required**: Yes (Admin)
- **Request Body**: Includes `name`, `imageUrl`, `description`, `category`.
- **Responses**:
  - **Success Response**:
    ```json
    {
      "name": "Elegant Wedding Dress",
      "imageUrl": "https://example.com/images/dress.jpg",
      "description": "A beautiful and elegant wedding dress.",
      "category": "Apparel"
    }
    ```
  - **Error Response**:
    ```json
    {
      "message": "Name, description, and category cannot be empty"
    }
    ```

#### Get All Products

- **URL**: `/product`
- **Method**: `GET`
- **Auth Required**: No
- **Query Parameters**: `page=[integer]`, `limit=[integer]`, `search=[string]`
- **Responses**:
  - **Success Response**:
    ```json
    {
      "page": 1,
      "limit": 10,
      "products": [
        {
          "_id": "5f77a9b3e84a2d001f2a3a8d",
          "name": "Elegant Wedding Dress",
          "imageUrl": "https://example.com/images/dress.jpg",
          "description": "A beautiful and elegant wedding dress.",
          "category": "Apparel"
        }
      ]
    }
    ```
  - **Error Response**:
    ```json
    {
      "message": "Failed to fetch products"
    }
    ```

#### Get Product By ID

- **URL**: `/product/:productId`
- **Method**: `GET`
- **Auth Required**: No
- **URL Parameters**: `productId=[string]`
- **Responses**:
  - **Success Response**:
    ```json
    {
      "_id": "5f77a9b3e84a2d001f2a3a8d",
      "name": "Elegant Wedding Dress",
      "imageUrl": "https://example.com/images/dress.jpg",
      "description": "A beautiful and elegant wedding dress.",
      "category": "Apparel"
    }
    ```
  - **Error Response**:
    ```json
    {
      "message": "Product not found"
    }
    ```

#### Edit Product

- **URL**: `/editproduct/:productId`
- **Method**: `PUT`
- **Auth Required**: Yes (Admin)
- **URL Parameters**: `productId=[string]`
- **Request Body**: Product details to be updated.
- **Responses**:
  - **Success Response**:
    ```json
    {
      "message": "Product updated successfully"
    }
    ```
  - **Error Response**:
    ```json
    {
      "message": "Failed to update product"
    }
    ```

#### Delete Product

- **URL**: `/deleteproduct/:productId`
- **Method**: `DELETE`
- **Auth Required**: Yes (Admin)
- **URL Parameters**: `productId=[string]`
- **Responses**:
  - **Success Response**:
    ```json
    {
      "message": "Product deleted successfully"
    }
    ```
  - **Error Response**:
    ```json
    {
      "message": "Product not found"
    }
    ```

### Add Images

- **URL**: `/add-images`
- **Method**: `POST`
- **Auth Required**: Yes
- **Content-Type**: `multipart/form-data`
- **Request Body**: Form data with one or more image files under the key `files`.
- **Responses**:
  - **Success Response**:
    ```json
    {
      "images": [
        {
          "imgUrl": "https://example.com/uploads/image1.jpg"
        }
      ]
    }
    ```
  - **Error Response**:
    ```json
    {
      "message": "Failed to upload images"
    }
    ```

#### Notes:

- The `createProduct` endpoint requires `name`, `description`, and `category` fields to be non-empty. The `imageUrl` is optional.
- The `editProduct` endpoint allows updating any product detail by providing the respective fields in the request body.
- The `addImages` endpoint requires setting up Cloudinary and configuring the environment variables (`CLOUND_NAME`, `API_KEY`, `API_SECRET`) correctly.
- Pagination in the `getAllProducts` endpoint defaults to page 1 with no limit if not specified. The `search` query parameter is optional and allows filtering products by name.


### Cart Operations

#### Add Product to Cart

- **URL**: `/cart/add`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**: 
  ```json
  {
    "productId": "string"
  }
  ```
- **Responses**:
  - **Success Response**:
    ```json
    {
      "message": "Product added to cart successfully"
    }
    ```
  - **Error Response**:
    ```json
    {
      "message": "you must create profile first"
    }
    ```

#### Get All Cart Items

- **URL**: `/cart/all`
- **Method**: `GET`
- **Auth Required**: Yes
- **Responses**:
  - **Success Response**:
    ```json
    [
      {
        "productId": "string",
        "quantity": "number"
      }
    ]
    ```
  - **Error Response**:
    ```json
    {
      "message": "Error message"
    }
    ```

#### Get Cart By ID

- **URL**: `/cart/:cartId`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Parameters**: `cartId=[string]`
- **Responses**:
  - **Success Response**:
    ```json
    {
      "productId": "string",
      "quantity": "number"
    }
    ```
  - **Error Response**:
    ```json
    {
      "message": "Cart not found"
    }
    ```

#### Delete Cart

- **URL**: `/cart/delete/:cartId`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **URL Parameters**: `cartId=[string]`
- **Responses**:
  - **Success Response**:
    ```json
    {
      "message": "Cart deleted successfully"
    }
    ```
  - **Error Response**:
    ```json
    {
      "message": "Cart not found"
    }
    ```

#### Update Cart

- **URL**: `/cart/update/:cartId`
- **Method**: `PUT`
- **Auth Required**: Yes
- **URL Parameters**: `cartId=[string]`
- **Request Body**: 
  ```json
  {
    "productId": "string",
    "quantity": "number"
  }
  ```
- **Responses**:
  - **Success Response**:
    ```json
    {
      "message": "Cart updated successfully"
    }
    ```
  - **Error Response**:
    ```json
    {
      "message": "Cart not found"
    }
    ```

This documentation reflects the operations available for managing cart items, including adding products to the cart, retrieving cart items, updating cart items, and deleting cart items. Each endpoint requires authentication, ensuring that cart operations are securely managed for each user.


### Profile Management

#### Create Profile

- **URL**: `/profile/create`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**: 
  ```json
  {
    "address": "string",
    "phoneNumber": "string"
  }
  ```
- **Responses**:
  - **Success Response**:
    ```json
    {
      "message": "Profile has been successfully created"
    }
    ```
  - **Error Response**:
    ```json
    {
      "message": "Error message detailing what went wrong"
    }
    ```

#### Get All Profiles

- **URL**: `/profile/all`
- **Method**: `GET`
- **Auth Required**: Yes
- **Responses**:
  - **Success Response**:
    ```json
    [
      {
        "userId": "string",
        "address": "string",
        "phoneNumber": "string"
      }
    ]
    ```
  - **Error Response**:
    ```json
    {
      "message": "Error message detailing what went wrong"
    }
    ```

#### Get User Profile By ID

- **URL**: `/profile/:userId`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Parameters**: `userId=[string]`
- **Responses**:
  - **Success Response**:
    ```json
    {
      "userId": "string",
      "address": "string",
      "phoneNumber": "string"
    }
    ```
  - **Error Response**:
    ```json
    {
      "message": "Profile not found"
    }
    ```

---

### Payment

Creates a new transaction for a payment process.

- **URL**

  `/create-transaction`

- **Method:**

  `POST`
  
- **Authentication:**

  None required for this example, but typically you would secure this endpoint with authentication middleware.

- **URL Params**

  None

- **Data Params**

  Required:
  
  ```json
  {
    "gross_amount": "[decimal]",
    "order_id": "[string]",
    "item_name": "[string]",
    "first_name": "[string]",
    "last_name": "[string]",
    "phone": "[string]",
    "address": "[string]",
    "city": "[string]",
    "postal_code": "[string]"
  }
  ```

- **Success Response:**

  - **Code:** 200 OK <br />
    **Content:** 
    ```json
    {
      "token": "[string]",
      "redirect_url": "[string]"
    }
    ```
  
- **Error Response:**

  - **Code:** 400 BAD REQUEST <br />
    **Content:** 
    ```json
    { "error": "BadRequest", "message": "Amount must be a number" }
    ```
    
  OR

  - **Code:** 400 BAD REQUEST <br />
    **Content:** 
    ```json
    { "error": "BadRequest", "message": "Order ID and Item Name are required" }
    ```

- **Sample Call:**

  ```javascript
  fetch('/create-transaction', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          gross_amount: 100.00,
          order_id: "order123",
          item_name: "Wedding Package",
          first_name: "John",
          last_name: "Doe",
          phone: "123456789",
          address: "1234 Main St",
          city: "Anytown",
          postal_code: "123456"
      })
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch((error) => console.error('Error:', error));
  ```

- **Notes:**

  The response includes a `token` and a `redirect_url` provided by the payment gateway (in this case, Midtrans) for further processing of the payment on the client side.

