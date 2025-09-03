import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';

function NoteForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const fetchNote = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/notes/${id}`);
      setTitle(response.data.title);
      setContent(response.data.content);
    } catch (error) {
      console.error('Error fetching note:', error);
      alert('Failed to load note');
    }
  }, [id]);

  useEffect(() => {
    if (isEditing) {
      fetchNote();
    }
  }, [isEditing, fetchNote]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isEditing) {
        await axios.put(`${API_BASE}/notes/${id}`, { title, content });
      } else {
        await axios.post(`${API_BASE}/notes/`, { title, content });
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>{isEditing ? '✏️ Edit Note' : '📝 Create New Note'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter note title..."
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note content here..."
            required
            disabled={loading}
          />
        </div>
        
        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading}
        >
          {loading ? '⏳ Saving...' : (isEditing ? '💾 Update Note' : '✨ Create Note')}
        </button>
        
        <button 
          type="button" 
          onClick={() => navigate('/')}
          style={{
            marginTop: '15px',
            background: 'none',
            border: '2px solid #6c757d',
            color: '#6c757d',
            padding: '12px 24px',
            borderRadius: '8px',
            width: '100%',
            cursor: 'pointer',
            fontWeight: '600'
          }}
          disabled={loading}
        >
          ↩️ Cancel
        </button>
      </form>
    </div>
  );
}

export default NoteForm;