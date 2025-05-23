from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import Note
import crud, schemas

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

@app.get("/notes", response_model=list[schemas.NoteOut])
def read_notes(db: Session = Depends(get_db)):
    return crud.get_notes(db)

@app.post("/notes", response_model=schemas.NoteOut)
def create_note(note: schemas.NoteCreate, db: Session = Depends(get_db)):
    return crud.create_note(db, note)

@app.put("/notes/{note_id}", response_model=schemas.NoteOut)
def update(note_id: int, note: schemas.NoteCreate, db: Session = Depends(get_db)):
    return crud.update_note(db, note_id, note)

@app.delete("/notes/{note_id}")
def delete(note_id: int, db: Session = Depends(get_db)):
    crud.delete_note(db, note_id)
    return {"ok": True}
