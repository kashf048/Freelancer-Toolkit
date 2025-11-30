from flask_jwt_extended import create_access_token, create_refresh_token

def generate_tokens(user_id: str, is_admin: bool):
    """Generates access and refresh tokens for a given user ID."""
    identity = str(user_id)
    additional_claims = {"is_admin": is_admin}
    
    access_token = create_access_token(identity=identity, additional_claims=additional_claims)
    refresh_token = create_refresh_token(identity=identity, additional_claims=additional_claims)
    
    return access_token, refresh_token
