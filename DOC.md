
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


## Packet Management Endpoints

### Get All Packets

Retrieves a list of all packets, with optional filters for pagination, search, sorting by price, and category filtering.

- **URL**: `/packet`
- **Method**: `GET`
- **Auth Required**: Yes
- **Query Parameters**:
  - `page`: Page number for pagination (optional)
  - `limit`: Number of packets per page (optional)
  - `search`: Keyword for searching packets by name (optional)
  - `sortByPrice`: Direction of price sorting, `1` for ascending, `-1` for descending (optional)
  - `category`: Filter packets by category (optional)

#### Success Response:

- **Code**: `200 OK`
- **Content**: 
```json
{
  "page": 1,
  "limit": 10,
  "packets": [
    {
      "name": "Basic Wedding Package",
      "imageUrl": "http://example.com/image.jpg",
      "description": "A basic wedding package.",
      "category": "Basic",
      "price": 1000
    }
  ]
}
```

### Get Packet By ID

Retrieves a single packet by its unique identifier.

- **URL**: `/packet/:packetId`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Parameters**:
  - `packetId`: The unique identifier of the packet

#### Success Response:

- **Code**: `200 OK`
- **Content**: 
```json
{
  "name": "Basic Wedding Package",
  "imageUrl": "http://example.com/image.jpg",
  "description": "A basic wedding package.",
  "category": "Basic",
  "price": 1000
}
```

### Create Packet

Allows for the creation of a new packet.

- **URL**: `/createpacket`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**:
  - `name` (required): Name of the packet
  - `imageUrl` (optional): Image URL of the packet
  - `description` (required): Description of the packet
  - `category` (required): Category of the packet
  - `price` (required): Price of the packet

#### Success Response:

- **Code**: `201 Created`
- **Content**: 
```json
{
  "name": "Deluxe Wedding Package",
  "imageUrl": "http://example.com/deluxe_image.jpg",
  "description": "A deluxe wedding package.",
  "category": "Deluxe",
  "price": 2000
}
```

### Update Packet

Updates an existing packet by its unique identifier.

- **URL**: `/editpacket/:packetId`
- **Method**: `PUT`
- **Auth Required**: Yes
- **URL Parameters**:
  - `packetId`: The unique identifier of the packet to update
- **Request Body**:
  - Any of the fields that can be created with the `Create Packet` endpoint

#### Success Response:

- **Code**: `200 OK`
- **Content**: 
```json
{
  "message": "Packet updated successfully"
}
```

### Delete Packet

Deletes a packet by its unique identifier.

- **URL**: `/deletepacket/:packetId`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **URL Parameters**:
  - `packetId`: The unique identifier of the packet to delete

#### Success Response:

- **Code**: `200 OK`
- **Content**: 
```json
{
  "message": "Packet deleted successfully"
}
```

### Add Images to Packet

Allows for adding multiple images to a packet. This endpoint might require a different setup or additional information on how images are uploaded (e.g., multipart/form-data for direct file uploads).

- **URL**: `/add-images`
- **Method**: `POST`
- **Auth Required**: Yes
- **Special Requirements**: This endpoint's implementation details are not fully provided. Ensure to handle image uploads appropriately.

#### Success Response:

- **Code**: `200 OK`
- **Content**: 
```json
{
  "images": [
    {
      "imgUrl": "http://example.com/image1.jpg"
    },
    {
      "imgUrl": "http://example.com/image2.jpg"
    }
  ]
}
```
Based on the provided `OrdersController` code, here's an API documentation draft for the Orders management endpoints of your wedding organization website backend.

---

# Orders Management Endpoints

### Create Order

Allows for the creation of a new order with details about the wedding, including names of the husband and wife, address, phone number, date of marriage, and product ID.

- **URL**: `/addOrders`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**:
  - `husbandName` (required): Name of the husband.
  - `wifeName` (required): Name of the wife.
  - `address` (required): Address for the wedding.
  - `phoneNumber` (required): Contact phone number.
  - `dateOfMerried` (required): Date of the marriage.
  - `PacketId` (required): ID of the product/service being ordered.

#### Success Response:

- **Code**: `201 Created`
- **Content**: 
```json
{
  "message": "Order created successfully",
  "orderId": "unique_order_id",
  "details": {
    "husbandName": "John Doe",
    "wifeName": "Jane Doe",
    "address": "123 Wedding Lane",
    "phoneNumber": "1234567890",
    "dateOfMerried": "2023-12-31",
    "PacketId": "pakcet_id"
  }
}
```

#### Error Response:

- **Code**: `400 Bad Request`
- **Content**: 
```json
{
  "message": "name of husband is required"
}
```

### Send Order Confirmation Email

Sends an email to the user with details about their order and a link to view payment details.

- **URL**: `/nodemailer`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**:
  - `id` (required): Bill ID to include in the email for payment details.

#### Success Response:

- **Code**: `200 OK`
- **Content**: 
```json
{
  "message": "success"
}
```

#### Error Response:

- **Code**: `500 Internal Server Error`
- **Content**: 
```json
{
  "message": "An error occurred while sending the email"
}
```

#### Notes:

- The email is sent using the `nodemailer` package with a predefined Gmail account. Ensure that the Gmail account's "Less secure app access" setting is enabled or use OAuth2 for authentication in a production environment.
- The email includes an HTML template with a personalized greeting, a thank you note, a call to action button linking to the payment details page, and contact information for further assistance.
- The `process.env.URL_CLIENT` environment variable is used to construct the link to the payment details page, ensuring that the link is dynamic and can be adjusted based on the environment (development, staging, production).
