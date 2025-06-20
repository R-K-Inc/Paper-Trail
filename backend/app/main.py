from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import Note
import crud, schemas
import uvicorn
from auth import hash_password, verify_password

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

@app.post("/api/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_pw = hash_password(user.password)
    return crud.create_user(db, user.username, hashed_pw)

@app.post("/api/login")
def login(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, user.username)
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    # Return JWT or session info here
    return {"message": "Login successful"}


if __name__=="__main__":
    uvicorn.run("main:app", host="0.0.0.0", reload=True, port=8000)