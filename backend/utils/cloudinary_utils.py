import cloudinary
import cloudinary.uploader
from config import settings

# Configuration 
cloudinary.config( 
    cloud_name = settings.CLOUDINARY_CLOUD_NAME, 
    api_key = settings.CLOUDINARY_API_KEY, 
    api_secret = settings.CLOUDINARY_API_SECRET,
    secure = True
)

def upload_image(file):
    """Uploads a file to Cloudinary and returns the URL"""
    try:
        upload_result = cloudinary.uploader.upload(file)
        return upload_result.get("secure_url")
    except Exception as e:
        print(f"Cloudinary upload error: {e}")
        return None
