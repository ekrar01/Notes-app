import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';

function SharedNote() {
  const [note, setNote] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { shareId } = useParams();

  const fetchSharedNote = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/share/${shareId}`);
      setNote(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching shared note:', error);
      setError('Note not found or sharing link is invalid');
    } finally {
      setLoading(false);
    }
  }, [shareId]);

  useEffect(() => {
    fetchSharedNote();
  }, [fetchSharedNote]);

  if (loading) {
    return <div className="loading">Loading shared note...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <h2>⚠️ Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="shared-note-container">
      <h1 className="shared-note-title">{note.title}</h1>
      
      <div className="shared-note-content">
        {note.content}
      </div>
      
      <div className="shared-note-meta">
        <p>📅 Shared on {new Date(note.updated_at).toLocaleDateString()} at {new Date(note.updated_at).toLocaleTimeString()}</p>
      </div>
    </div>
  );
}

export default SharedNote;