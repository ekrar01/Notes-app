from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List
import uuid
from datetime import datetime
from sqlalchemy import create_engine, Column, String, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import os

# Database setup
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database models
class DBNote(Base):
    __tablename__ = "notes"
    id = Column(String, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    share_id = Column(String, unique=True, index=True)

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic models
class NoteBase(BaseModel):
    title: str
    content: str

class NoteCreate(NoteBase):
    pass

class Note(NoteBase):
    id: str
    created_at: datetime
    updated_at: datetime
    share_id: str

    class Config:
        from_attributes = True

# FastAPI app
app = FastAPI(title="Notes API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Routes
@app.get("/")
def read_root():
    return {"message": "Notes API"}

@app.post("/notes/", response_model=Note)
def create_note(note: NoteCreate, db: Session = Depends(get_db)):
    share_id = str(uuid.uuid4())[:8]  # Generate short share ID
    db_note = DBNote(
        id=str(uuid.uuid4()),
        title=note.title,
        content=note.content,
        share_id=share_id
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

@app.get("/notes/", response_model=List[Note])
def read_notes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    notes = db.query(DBNote).offset(skip).limit(limit).all()
    return notes

@app.get("/notes/{note_id}", response_model=Note)
def read_note(note_id: str, db: Session = Depends(get_db)):
    db_note = db.query(DBNote).filter(DBNote.id == note_id).first()
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return db_note

@app.get("/share/{share_id}", response_model=Note)
def read_note_by_share_id(share_id: str, db: Session = Depends(get_db)):
    db_note = db.query(DBNote).filter(DBNote.share_id == share_id).first()
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return db_note

@app.get("/notes/{note_id}/share")
def get_note_share_link(note_id: str, db: Session = Depends(get_db)):
    db_note = db.query(DBNote).filter(DBNote.id == note_id).first()
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    
    # Return the share URL
    return JSONResponse({"share_url": f"/share/{db_note.share_id}"})

@app.put("/notes/{note_id}", response_model=Note)
def update_note(note_id: str, note: NoteCreate, db: Session = Depends(get_db)):
    db_note = db.query(DBNote).filter(DBNote.id == note_id).first()
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    
    db_note.title = note.title
    db_note.content = note.content
    db.commit()
    db.refresh(db_note)
    return db_note

@app.delete("/notes/{note_id}")
def delete_note(note_id: str, db: Session = Depends(get_db)):
    db_note = db.query(DBNote).filter(DBNote.id == note_id).first()
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    
    db.delete(db_note)
    db.commit()
    return {"message": "Note deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
