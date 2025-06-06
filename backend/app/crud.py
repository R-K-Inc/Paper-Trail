from sqlalchemy.orm import Session
from models import Note
from schemas import NoteCreate

def get_notes(db: Session):
    return db.query(Note).all()

def create_note(db: Session, note: NoteCreate):
    db_note = Note(title=note.title, content=note.content)
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

def update_note(db: Session, note_id: int, note: NoteCreate):
    db_note = db.query(Note).filter(Note.id == note_id).first()
    if db_note:
        db_note.title = note.title
        db_note.content = note.content
        db.commit()
        db.refresh(db_note)
    return db_note


def delete_note(db: Session, note_id: int):
    note = db.query(Note).filter(Note.id == note_id).first()
    db.delete(note)
    db.commit()