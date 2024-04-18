
# Project API Documentation

## Overview

This documentation covers the backend API endpoints for a wedding organization website. It includes endpoints for user management, product browsing, cart operations, and other functionalities essential to the platform.

## Base URL

`http://localhost:3000`

## Authentication

Most endpoints require authentication. Ensure requests include a valid authentication token, typically passed in the header.

## Endpoints

### User Management

#### Register User

- **URL**: `http://localhost:3000/users/register`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**: Includes user registration details like `username`, `email`, and `password`.
- **Responses**: Success message or error details.

#### Login User

- **URL**: `http://localhost:3000/users/login`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**: Includes `email` and `password`.
- **Responses**: Authentication token and user details on success.

### Product Management

#### Add Product

- **URL**: `http://localhost:3000/products/add`
- **Method**: `POST`
- **Auth Required**: Yes (Admin)
- **Request Body**: Includes product details.
- **Responses**: Success message or error details.

#### Get All Products

- **URL**: `http://localhost:3000/products`
- **Method**: `GET`
- **Auth Required**: No
- **Responses**: List of products.

### Cart Operations

#### Add Product to Cart

- **URL**: `http://localhost:3000/cart/add`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**: `{ "productId": "string" }`
- **Responses**: Success message or error details.

#### Get All Cart Items

- **URL**: `http://localhost:3000/cart/all`
- **Method**: `GET`
- **Auth Required**: Yes
- **Responses**: Array of cart items.

#### Get Cart By ID

- **URL**: `http://localhost:3000/cart/:cartId`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Parameters**: `cartId=[string]`
- **Responses**: Cart object.

#### Delete Cart

- **URL**: `http://localhost:3000/cart/delete/:cartId`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **URL Parameters**: `cartId=[string]`
- **Responses**: Success or error message.

#### Update Cart

- **URL**: `http://localhost:3000/cart/update/:cartId`
- **Method**: `PUT`
- **Auth Required**: Yes
- **URL Parameters**: `cartId=[string]`
- **Request Body**: `{ "productId": "string", "quantity": "number" }`
- **Responses**: Success or error message.

---

## Error Codes

- `200 OK`: The request was successful.
- `400 Bad Request`: The request was malformed or invalid.
- `401 Unauthorized`: Authentication is required and has failed or has not been provided.
- `404 Not Found`: The requested resource could not be found.
- `500 Internal Server Error`: An unexpected error occurred on the server.

## Notes

- This template is a starting point. Each endpoint should be documented with detailed request and response examples, including headers, body content, and any query parameters.
- Ensure to document any specific headers required for your API, such as `Authorization` for passing JWT tokens.
- Update and expand upon this template with specifics from your project, including any additional endpoints, detailed request/response models, and authentication details.

This structured approach to API documentation will help developers understand and integrate with your backend services more effectively.