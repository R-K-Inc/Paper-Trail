from sqlalchemy.orm import Session
from .models import Note, User
from .schemas import NoteCreate

def get_notes(db: Session, user_id: int):
    notes = db.query(Note).filter(Note.owner_id == user_id).all()
    for note in notes:
        note.tags = note.tags.split(",") if note.tags else []
    return notes

def create_note(db: Session, note: NoteCreate, user_id: int):
    db_note = Note(
        title=note.title,
        content=note.content,
        category=note.category,
        tags=",".join(note.tags) if note.tags else "",
        owner_id=user_id
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    db_note.tags = db_note.tags.split(",") if db_note.tags else []
    return db_note

def update_note(db: Session, note_id: int, note: NoteCreate, user_id: int):
    db_note = db.query(Note).filter(Note.id == note_id, Note.owner_id == user_id).first()
    if db_note:
        db_note.title = note.title
        db_note.content = note.content
        db_note.category = note.category
        db_note.tags=",".join(note.tags) if note.tags else ""
        db.commit()
        db.refresh(db_note)
        db_note.tags = db_note.tags.split(",") if db_note.tags else []
    return db_note


def delete_note(db: Session, note_id: int, user_id: int):
    note = db.query(Note).filter(Note.id == note_id, Note.owner_id == user_id).first()
    if note:
        db.delete(note)
        db.commit()
    return note

def get_user_by_username(db, username: str):
    return db.query(User).filter(User.username == username).first()

def create_user(db, username: str, hashed_password: str):
    user = User(username=username, hashed_password=hashed_password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user