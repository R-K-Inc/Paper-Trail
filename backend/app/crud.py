from sqlalchemy.orm import Session
from models import Note
from schemas import NoteCreate

def get_notes(db: Session):
    notes = db.query(Note).all()
    for note in notes:
        note.tags = note.tags.split(",") if note.tags else []
    return notes

def create_note(db: Session, note: NoteCreate):
    db_note = Note(
        title=note.title,
        content=note.content,
        category=note.category,
        tags=",".join(note.tags) if note.tags else ""
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    db_note.tags = db_note.tags.split(",") if db_note.tags else []
    return db_note

def update_note(db: Session, note_id: int, note: NoteCreate):
    db_note = db.query(Note).filter(Note.id == note_id).first()
    if db_note:
        db_note.title = note.title
        db_note.content = note.content
        db_note.category = note.category
        db.commit()
        db.refresh(db_note)
        db_note.tags = db_note.tags.split(",") if db_note.tags else []
    return db_note


def delete_note(db: Session, note_id: int):
    note = db.query(Note).filter(Note.id == note_id).first()
    db.delete(note)
    db.commit()