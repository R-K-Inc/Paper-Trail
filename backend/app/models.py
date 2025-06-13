from sqlalchemy import Column, Integer, String, DateTime
from database import Base
from datetime import datetime


class Note(Base):
    __tablename__="notes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)