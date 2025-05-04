from flask import Flask, render_template, request, jsonify, redirect, url_for, flash
import jwt
import json
import os
import secrets
from datetime import datetime, timedelta
from functools import wraps

app = Flask(__name__)
app.config['SECRET_KEY'] = secrets.token_hex(16)

# Helper function to format JSON
def format_json(data):
    return json.dumps(data, indent=2)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/decode', methods=['POST'])
def decode():
    token = request.form.get('token', '').strip()
    
    if not token:
        return render_template('index.html', decode_error="Please enter a JWT token")
    
    try:
        # Split the token to get the parts
        parts = token.split('.')
        if len(parts) != 3:
            return render_template('index.html', decode_error="Invalid token format")
        
        # Handle padding for proper base64 decoding
        def add_padding(input_str):
            padding = len(input_str) % 4
            if padding:
                input_str += '=' * (4 - padding)
            return input_str
        
        # Decode header
        header_bytes = parts[0].replace('-', '+').replace('_', '/')
        header_bytes = add_padding(header_bytes)
        header = json.loads(jwt.utils.base64url_decode(parts[0]).decode('utf-8'))
        
        # Decode payload
        payload = json.loads(jwt.utils.base64url_decode(parts[1]).decode('utf-8'))
        
        # Signature part (we don't decode it, just display it)
        signature = parts[2]
        
        decoded_token = {
            'header': format_json(header),
            'payload': format_json(payload),
            'signature': signature
        }
        
        return render_template('index.html', decoded_token=decoded_token)
        
    except Exception as e:
        return render_template('index.html', decode_error=f"Error decoding token: {str(e)}")

@app.route('/encode', methods=['POST'])
def encode():
    try:
        # Get header values
        alg = request.form.get('alg', 'HS256')
        typ = request.form.get('typ', 'JWT')
        
        # Create header
        header = {
            'alg': alg,
            'typ': typ
        }
        
        # Get all claims
        claim_keys = request.form.getlist('claim_keys[]')
        claim_values = request.form.getlist('claim_values[]')
        
        if len(claim_keys) != len(claim_values):
            return render_template('index.html', encode_error="Invalid claims data")
        
        # Create payload
        payload = {}
        for i in range(len(claim_keys)):
            if claim_keys[i].strip():
                value = claim_values[i]
                
                # Try to convert numbers and booleans
                if value.lower() == 'true':
                    value = True
                elif value.lower() == 'false':
                    value = False
                elif value.isdigit():
                    value = int(value)
                elif value.replace('.', '', 1).isdigit() and value.count('.') == 1:
                    value = float(value)
                
                payload[claim_keys[i]] = value
        
        # Get secret
        secret = request.form.get('secret', '')
        
        # Create JWT token
        if alg == 'none':
            # Create unsigned token
            token = jwt.encode(payload, None, algorithm=None, headers=header)
        else:
            if not secret:
                return render_template('index.html', encode_error="Secret key is required for this algorithm")
            
            token = jwt.encode(payload, secret, algorithm=alg, headers=header)
        
        # PyJWT might return bytes in some versions, so convert to string if needed
        if isinstance(token, bytes):
            token = token.decode('utf-8')
        
        return render_template('index.html', encoded_token=token)
        
    except Exception as e:
        return render_template('index.html', encode_error=f"Error encoding token: {str(e)}")

@app.route('/api/decode', methods=['POST'])
def api_decode():
    data = request.get_json()
    token = data.get('token', '')
    
    if not token:
        return jsonify({'error': 'Token is required'}), 400
    
    try:
        # Split the token
        parts = token.split('.')
        if len(parts) != 3:
            return jsonify({'error': 'Invalid token format'}), 400
        
        # Decode header and payload
        header = json.loads(jwt.utils.base64url_decode(parts[0]).decode('utf-8'))
        payload = json.loads(jwt.utils.base64url_decode(parts[1]).decode('utf-8'))
        
        return jsonify({
            'header': header,
            'payload': payload,
            'signature': parts[2]
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/encode', methods=['POST'])
def api_encode():
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'Invalid data'}), 400
    
    try:
        header = data.get('header', {'alg': 'HS256', 'typ': 'JWT'})
        payload = data.get('payload', {})
        secret = data.get('secret', '')
        
        if header.get('alg') != 'none' and not secret:
            return jsonify({'error': 'Secret is required for this algorithm'}), 400
        
        # Create JWT token
        if header.get('alg') == 'none':
            token = jwt.encode(payload, None, algorithm=None, headers=header)
        else:
            token = jwt.encode(payload, secret, algorithm=header.get('alg'), headers=header)
        
        # PyJWT might return bytes in some versions, so convert to string if needed
        if isinstance(token, bytes):
            token = token.decode('utf-8')
        
        return jsonify({'token': token})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
