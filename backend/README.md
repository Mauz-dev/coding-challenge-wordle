# Backend Setup Guide

## 🚀 Quick Start

The Wordle Challenge backend provides a **dummy API endpoint**. Implement the real wordle API. 

### Prerequisites
- PHP 8.3 or higher
- A web server (Apache/Nginx) or PHP built-in server

### Starting the Server

#### PHP Built-in Server (Recommended for Development)
```bash
cd backend
# Start the development server
php -S localhost:8000
```

## 📁 File Structure

```
backend/
├── api/                   # TODO: Implement API endpoints
│   
├── words.txt              # List of valid 5-letter words
├── .htaccess              # Apache URL rewriting rules
└── README.md              # This file
```

## 🔧 Configuration

### PHP Version
This project requires PHP 8.3 or higher. The `composer.json` file specifies this requirement:
```json
{
  "require": {
    "php": ">=8.3"
  }
}
```

### CORS Headers
The API includes CORS headers to allow cross-origin requests from your React frontend:

```php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
```

### Word List
The `words.txt` file contains valid 5-letter words. You can:
- Add new words (one per line, uppercase)
- Remove words you don't want in the game
- Replace with a different word list entirely

## 🧪 Testing

### Using cURL
```bash
# Start a new game
curl http://localhost:8000/api/get-dummy-response.php

# Make a guess
curl -X POST http://localhost:8000/api/get-dummy-response.php \
  -H "Content-Type: application/json" \
  -d '{"guess":"HELLO"}'
```

### Using a REST Client
- **Postman**: Import the endpoints and test directly
- **Thunder Client** (VS Code): Create requests for each endpoint
- **Browser**: Use developer tools console with fetch()