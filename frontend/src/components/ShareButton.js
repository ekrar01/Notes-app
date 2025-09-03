import axios from 'axios';
import { useState } from 'react';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';

function ShareButton({ noteId }) {
  const [shareUrl, setShareUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateShareLink = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/notes/${noteId}/share`);
      const fullUrl = `${window.location.origin}${response.data.share_url}`;
      setShareUrl(fullUrl);
    } catch (error) {
      console.error('Error generating share link:', error);
      alert('Failed to generate share link');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div>
      <button 
        onClick={generateShareLink} 
        className="btn btn-success"
        disabled={loading}
        style={{ minWidth: '120px' }}
      >
        {loading ? '⏳' : '📤'} Share
      </button>
      
      {shareUrl && (
        <div className="share-container">
          <p style={{ margin: '0 0 10px 0', fontWeight: '600', color: '#2c3e50' }}>
            Share this link:
          </p>
          <input 
            type="text" 
            value={shareUrl} 
            readOnly 
            className="share-url-input"
          />
          <button 
            onClick={copyToClipboard}
            className="btn"
            style={{ 
              background: isCopied ? '#27ae60' : '#3498db',
              width: '100%'
            }}
          >
            {isCopied ? '✅ Copied!' : '📋 Copy Link'}
          </button>
        </div>
      )}
    </div>
  );
}

export default ShareButton;