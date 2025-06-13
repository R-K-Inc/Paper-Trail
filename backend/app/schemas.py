from pydantic import BaseModel 
from datetime import datetime
from typing import Optional, List


class NoteCreate(BaseModel):
    title: str
    content: str
    category: Optional[str] = None
    tags: Optional[List[str]] = []
    

class NoteOut(NoteCreate):
    id: int
    created_at: datetime
    category: Optional[str] = None
    class Config:
        orm_mode = True