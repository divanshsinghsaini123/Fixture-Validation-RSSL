from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
from utils.cloudinary_utils import upload_image

router = APIRouter(prefix="/api/upload", tags=["Upload"])

@router.post("")
async def upload_files(files: List[UploadFile] = File(...)):
    urls = []
    for file in files:
        # Read file content
        content = await file.read()
        url = upload_image(content)
        if url:
            urls.append(url)
        else:
            raise HTTPException(status_code=500, detail=f"Failed to upload {file.filename}")
    
    return {"urls": urls}
