# JWT-Token-Manager
This document outlines the structure of the JWT Token Manager web application.
## Directory Structure

```
jwt_token_manager/
├── app.py                  # Flask application file
├── requirements.txt        # Python dependencies
├── static/
│   ├── css/
│   │   └── styles.css      # CSS styles for the application
│   └── js/
│       └── script.js       # JavaScript for client-side functionality
└── templates/
    └── index.html          # Main HTML template
```

## Installation Instructions

1. Create a virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - On Windows:
     ```
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```
     source venv/bin/activate
     ```

3. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

4. Run the application:
   ```
   python app.py
   ```

5. Open your browser and navigate to:
   ```
   http://127.0.0.1:5000
   ```

## Dependencies

Create a `requirements.txt` file with the following content:

```
flask==2.3.3
pyjwt==2.8.0
```

## Features

- **Decode JWT Tokens**: Paste any JWT token to view its header, payload, and signature
- **Encode JWT Tokens**: Create new tokens with custom claims and algorithms
- **API Endpoints**: Use REST API endpoints for programmatic access
- **Professional UI**: Modern, responsive design with a clean interface
- **Client-side Validation**: Form validation to ensure proper data input
- **Copy to Clipboard**: One-click copying of generated tokens
- **Generate Random Secret**: Securely generate random secret keys

## API Endpoints

### Decode a Token

**Endpoint**: `/api/decode`  
**Method**: POST  
**Content-Type**: application/json  
**Request Body**:
```json
{
  "token": "your.jwt.token"
}
```
**Response**:
```json
{
  "header": { "alg": "HS256", "typ": "JWT" },
  "payload": { "sub": "1234567890", "name": "John Doe" },
  "signature": "signature_part"
}
```

### Encode a Token

**Endpoint**: `/api/encode`  
**Method**: POST  
**Content-Type**: application/json  
**Request Body**:
```json
{
  "header": { "alg": "HS256", "typ": "JWT" },
  "payload": { "sub": "1234567890", "name": "John Doe" },
  "secret": "your-secret-key"
}
```
**Response**:
```json
{
  "token": "generated.jwt.token"
}
```
