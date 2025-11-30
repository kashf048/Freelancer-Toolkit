import cloudinary
import cloudinary.uploader
from flask import current_app
import os

def init_cloudinary():
    """Initializes Cloudinary configuration."""
    cloudinary.config(
        cloud_name=current_app.config['CLOUDINARY_CLOUD_NAME'],
        api_key=current_app.config['CLOUDINARY_API_KEY'],
        api_secret=current_app.config['CLOUDINARY_API_SECRET']
    )

def upload_file(file_path, folder="documents"):
    """Uploads a file to Cloudinary and returns the secure URL."""
    try:
        init_cloudinary()
        
        # Check if file exists before uploading
        if not os.path.exists(file_path):
            current_app.logger.error(f"File not found for upload: {file_path}")
            return None

        # Upload the file
        result = cloudinary.uploader.upload(
            file_path,
            folder=folder,
            resource_type="auto"
        )
        
        return result.get('secure_url')
        
    except cloudinary.exceptions.Error as e:
        current_app.logger.error(f"Cloudinary upload error: {e}")
        return None
    except Exception as e:
        current_app.logger.error(f"General upload error: {e}")
        return None
