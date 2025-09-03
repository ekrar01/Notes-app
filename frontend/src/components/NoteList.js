import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ShareButton from './ShareButton';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';

function NoteList() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${API_BASE}/notes/`);
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await axios.delete(`${API_BASE}/notes/${id}`);
        fetchNotes();
      } catch (error) {
        console.error('Error deleting note:', error);
        alert('Failed to delete note');
      }
    }
  };

  if (loading) {
    return (
      <div className="notes-container">
        <div className="loading">Loading your notes...</div>
      </div>
    );
  }

  return (
    <div className="notes-container">
      <div className="notes-header">
        <h2>My Notes</h2>
        <Link to="/create" className="create-btn">
          + Create New Note
        </Link>
      </div>

      {notes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
          <h3>No notes yet</h3>
          <p>Create your first note to get started!</p>
        </div>
      ) : (
        <ul className="notes-list">
          {notes.map(note => (
            <li key={note.id} className="note-item">
              <div className="note-header">
                <h3 className="note-title">{note.title}</h3>
                <div className="note-actions">
                  <Link to={`/edit/${note.id}`} className="btn btn-primary">
                    ✏️ Edit
                  </Link>
                  <button 
                    onClick={() => deleteNote(note.id)} 
                    className="btn btn-danger"
                  >
                    🗑️ Delete
                  </button>
                  <ShareButton noteId={note.id} />
                  <Link to={`/share/${note.share_id}`} className="btn btn-secondary">
                    👁️ View Shared
                  </Link>
                </div>
              </div>
              <p className="note-content">
                {note.content.substring(0, 150)}
                {note.content.length > 150 ? '...' : ''}
              </p>
              <div style={{ color: '#95a5a6', fontSize: '0.9em' }}>
                Created: {new Date(note.created_at).toLocaleDateString()} • 
                Updated: {new Date(note.updated_at).toLocaleDateString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NoteList;