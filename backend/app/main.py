from fastapi import FastAPI, Depends, HTTPException, status, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from .database import SessionLocal, engine, Base
from .models import Note, User
from . import crud, schemas
import uvicorn
from .auth import hash_password, verify_password
import uuid
import os

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # For local development
        "https://paper-trail-v9yd.onrender.com", 
        "https://*.onrender.com" 
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple in-memory session store (use Redis in production)
active_sessions = {}

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(request: Request, db: Session = Depends(get_db)):
    session_id = request.cookies.get("session_id")
    if not session_id or session_id not in active_sessions:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    username = active_sessions[session_id]
    user = crud.get_user_by_username(db, username)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# API Routes
@app.get("/api/notes", response_model=list[schemas.NoteOut])
def read_notes(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return crud.get_notes(db, user_id=current_user.id)

@app.post("/api/notes", response_model=schemas.NoteOut)
def create_note(note: schemas.NoteCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return crud.create_note(db, note, user_id=current_user.id)

@app.put("/api/notes/{note_id}", response_model=schemas.NoteOut)
def update(note_id: int, note: schemas.NoteCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_note = crud.update_note(db, note_id, note, user_id=current_user.id)
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return db_note

@app.delete("/api/notes/{note_id}")
def delete(note_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not crud.delete_note(db, note_id, user_id=current_user.id):
        raise HTTPException(status_code=404, detail="Note not found")
    return {"ok": True}

@app.post("/api/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_pw = hash_password(user.password)
    return crud.create_user(db, user.username, hashed_pw)

@app.post("/api/login")
def login(user: schemas.UserCreate, response: Response, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, user.username)
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create session
    session_id = str(uuid.uuid4())
    active_sessions[session_id] = db_user.username
    
    # Set cookie
    response.set_cookie(
        key="session_id",
        value=session_id,
        httponly=True,
        max_age=1800,  # 30 minutes
        samesite="lax"
    )
    
    return {"message": "Logged in successfully", "user": {"id": db_user.id, "username": db_user.username}}

@app.post("/api/logout")
def logout(request: Request, response: Response):
    session_id = request.cookies.get("session_id")
    if session_id and session_id in active_sessions:
        del active_sessions[session_id]
    response.delete_cookie("session_id")
    return {"message": "Logged out successfully"}

@app.get("/api/me", response_model=schemas.UserOut)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user

# Static file serving for React app
static_dir = os.path.join(os.path.dirname(__file__), "static")

# Serve static assets (JS, CSS, images, etc.)
if os.path.exists(static_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(static_dir, "assets")), name="assets")

# Health check endpoint (useful for Render)
@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

# Serve React app for all non-API routes
@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    # Don't interfere with API routes
    if full_path.startswith("api/"):
        raise HTTPException(status_code=404, detail="API endpoint not found")

    if full_path.endswith(('.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot')):
        file_path = os.path.join(static_dir, full_path)
        if os.path.exists(file_path):
            return FileResponse(file_path)
    
    index_file = os.path.join(static_dir, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    else:
        raise HTTPException(status_code=404, detail="App not found")

if __name__=="__main__":
    uvicorn.run("main:app", host="0.0.0.0", reload=True, port=8000)