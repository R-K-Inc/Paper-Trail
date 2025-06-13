from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import Note
import crud, schemas
import uvicorn

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/api/notes", response_model=list[schemas.NoteOut])
def read_notes(db: Session = Depends(get_db)):
    return crud.get_notes(db)

@app.post("/api/notes", response_model=schemas.NoteOut)
def create_note(note: schemas.NoteCreate, db: Session = Depends(get_db)):
    return crud.create_note(db, note)

@app.put("/api/notes/{note_id}", response_model=schemas.NoteOut)
def update(note_id: int, note: schemas.NoteCreate, db: Session = Depends(get_db)):
    return crud.update_note(db, note_id, note)

@app.delete("/api/notes/{note_id}")
def delete(note_id: int, db: Session = Depends(get_db)):
    crud.delete_note(db, note_id)
    return {"ok": True}


if __name__=="__main__":
    uvicorn.run("main:app", host="0.0.0.0", reload=True, port=8000)