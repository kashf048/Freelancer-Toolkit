from flask import current_app, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, get_jwt
from pymongo.errors import DuplicateKeyError
from bson.objectid import ObjectId
from models.user_model import User
from utils.auth_utils import hash_password, verify_password
from utils.jwt_utils import generate_tokens
from utils.google_oauth_utils import get_google_auth_url, handle_google_callback # Placeholder for Google OAuth

def get_user_collection():
    return current_app.db.users

def register_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    first_name = data.get('first_name')
    last_name = data.get('last_name')

    if not all([email, password, first_name, last_name]):
        return jsonify({"message": "Missing required fields"}), 400

    users = get_user_collection()
    if users.find_one({"email": email}):
        return jsonify({"message": "User with this email already exists"}), 409

    try:
        password_hash = hash_password(password)
        new_user = User(
            email=email,
            password_hash=password_hash,
            first_name=first_name,
            last_name=last_name,
            is_admin=False # Default to non-admin
        )
        
        # Check if this is the first user to register, make them admin
        if users.count_documents({}) == 0:
            new_user.is_admin = True

        result = users.insert_one(new_user.__dict__)
        
        access_token, refresh_token = generate_tokens(result.inserted_id, new_user.is_admin)

        return jsonify({
            "message": "User registered successfully",
            "user": new_user.to_dict(),
            "access_token": access_token,
            "refresh_token": refresh_token
        }), 201

    except DuplicateKeyError:
        return jsonify({"message": "User with this email already exists"}), 409
    except Exception as e:
        current_app.logger.error(f"Registration error: {e}")
        return jsonify({"message": "An error occurred during registration"}), 500

def login_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({"message": "Missing email or password"}), 400

    users = get_user_collection()
    user_data = users.find_one({"email": email})

    if user_data and verify_password(password, user_data['password_hash']):
        user = User.from_dict(user_data)
        access_token, refresh_token = generate_tokens(user._id, user.is_admin)
        
        return jsonify({
            "message": "Login successful",
            "user": user.to_dict(),
            "access_token": access_token,
            "refresh_token": refresh_token
        }), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401

@jwt_required(refresh=True)
def refresh_token():
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    is_admin = claims.get('is_admin', False)
    
    new_access_token = create_access_token(identity=current_user_id, additional_claims={"is_admin": is_admin})
    
    return jsonify({
        "access_token": new_access_token
    }), 200

# Placeholder for Forgot Password / Reset Password logic
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    
    # In a real application, this would generate a token, save it to the DB, 
    # and send an email with a reset link.
    # For now, we'll return a success message.
    
    if not email:
        return jsonify({"message": "Missing email"}), 400
        
    users = get_user_collection()
    if not users.find_one({"email": email}):
        # Still return success to prevent email enumeration
        pass 
        
    # TODO: Implement email sending logic using Gmail API service
    
    return jsonify({"message": "If the email is registered, a password reset link has been sent."}), 200

def reset_password():
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('new_password')
    
    if not all([token, new_password]):
        return jsonify({"message": "Missing token or new password"}), 400
        
    # In a real application, this would verify the token, find the user, 
    # update the password hash, and invalidate the token.
    
    # Placeholder logic:
    # 1. Verify token validity and expiration
    # 2. Find user associated with token
    # 3. Hash new_password
    # 4. Update user's password_hash in DB
    # 5. Invalidate the reset token
    
    return jsonify({"message": "Password has been reset successfully."}), 200

# Placeholder for Google OAuth routes
def google_login():
    return get_google_auth_url()

def google_callback():
    return handle_google_callback()
