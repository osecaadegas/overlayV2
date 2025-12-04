import { useState, useRef, useEffect } from 'react';
import './ArtAdPanel.css';
import useDraggable from '../../hooks/useDraggable';

const ArtAdPanel = ({ onClose }) => {
  const [media, setMedia] = useState([]);
  const [mediaUrl, setMediaUrl] = useState('');
  const [displayedMedia, setDisplayedMedia] = useState([]);

  const addMedia = () => {
    if (mediaUrl.trim()) {
      let url = mediaUrl.trim();
      let filename = url.split('/').pop().split('?')[0] || 'Media';
      let mediaType = 'image';
      
      // Check if it's a YouTube URL and convert to embed format
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = '';
        if (url.includes('youtube.com/watch')) {
          videoId = new URL(url).searchParams.get('v');
        } else if (url.includes('youtu.be/')) {
          videoId = url.split('youtu.be/')[1].split('?')[0];
        } else if (url.includes('youtube.com/embed/')) {
          videoId = url.split('youtube.com/embed/')[1].split('?')[0];
        }
        if (videoId) {
          url = `https://www.youtube.com/embed/${videoId}`;
          filename = `YouTube: ${videoId}`;
          mediaType = 'youtube';
        }
      } else if (url.match(/\.(mp4|webm|ogg|mov)$/i) || url.includes('data:video')) {
        mediaType = 'video';
      }
      
      const newMedia = {
        id: Date.now(),
        title: filename,
        url: url,
        type: mediaType
      };
      setMedia([...media, newMedia]);
      setMediaUrl('');
    }
  };

  const removeMedia = (id) => {
    setMedia(media.filter(m => m.id !== id));
    setDisplayedMedia(displayedMedia.filter(m => m.id !== id));
  };

  const showMedia = (mediaItem) => {
    const newDisplayedMedia = {
      ...mediaItem,
      displayId: `${mediaItem.id}-${Date.now()}`,
      width: mediaItem.type === 'youtube' ? 560 : 400,
      height: mediaItem.type === 'youtube' ? 315 : mediaItem.type === 'video' ? 225 : 300,
      x: window.innerWidth / 2 - (mediaItem.type === 'youtube' ? 280 : 200),
      y: window.innerHeight / 2 - (mediaItem.type === 'youtube' ? 157.5 : 150)
    };
    setDisplayedMedia([...displayedMedia, newDisplayedMedia]);
  };

  const hideMedia = (displayId) => {
    setDisplayedMedia(displayedMedia.filter(m => m.displayId !== displayId));
  };

  const updateMediaSize = (displayId, width, height) => {
    setDisplayedMedia(displayedMedia.map(m =>
      m.displayId === displayId ? { ...m, width, height } : m
    ));
  };

  const updateMediaPosition = (displayId, x, y) => {
    setDisplayedMedia(displayedMedia.map(m =>
      m.displayId === displayId ? { ...m, x, y } : m
    ));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setMediaUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const draggableRef = useDraggable(true, 'artad');

  return (
    <>
      <div className="artad-panel" ref={draggableRef}>
        <div className="artad-header drag-handle">
          <h2>🖼️ Media Manager</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="artad-content">
          <div className="media-add-section">
            <input
              type="text"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="Enter URL or upload file..."
              className="media-url-input"
            />
            <div className="media-action-buttons">
              <button 
                className="media-upload-btn"
                onClick={() => document.getElementById('media-file-upload').click()}
                title="Upload File"
              >
                📁 Upload
              </button>
              <button className="media-add-btn" onClick={addMedia} title="Add Media">
                + Add
              </button>
              <input
                type="file"
                id="media-file-upload"
                accept="image/*,video/*"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
            </div>
          </div>

          <div className="media-grid">
            {media.length === 0 ? (
              <div className="no-media">
                <div className="no-media-icon">🖼️</div>
                <p>No media added</p>
              </div>
            ) : (
              media.map(item => (
                    <div key={item.id} className="media-card">
                  <div className="media-card-preview">
                    {item.type === 'youtube' ? (
                      <iframe src={item.url} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{width: '100%', height: '100%'}} />
                    ) : item.type === 'video' ? (
                      <video src={item.url} />
                    ) : (
                      <img src={item.url} alt={item.title} />
                    )}
                    <div className="media-card-type-badge">{item.type === 'youtube' ? '▶️' : item.type === 'video' ? '🎥' : '🖼️'}</div>
                  </div>
                  <div className="media-card-footer">
                    <div className="media-card-title" title={item.title}>{item.title.length > 15 ? item.title.substring(0, 15) + '...' : item.title}</div>
                  </div>
                  <div className="media-card-actions">
                    <button 
                      className="ad-action-btn show"
                      onClick={() => showMedia(item)}
                    >
                      👁️ Show
                    </button>
                    <button 
                      className="ad-action-btn hide"
                      onClick={() => setDisplayedMedia(displayedMedia.filter(m => m.id !== item.id))}
                      disabled={!displayedMedia.some(m => m.id === item.id)}
                    >
                      🙈 Hide
                    </button>
                    <button 
                      className="ad-action-btn remove"
                      onClick={() => removeMedia(item.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {displayedMedia.map(item => (
        <DraggableMedia
          key={item.displayId}
          item={item}
          onClose={() => hideMedia(item.displayId)}
          onSizeChange={(w, h) => updateMediaSize(item.displayId, w, h)}
          onPositionChange={(x, y) => updateMediaPosition(item.displayId, x, y)}
        />
      ))}
    </>
  );
};

const DraggableMedia = ({ item, onClose, onSizeChange, onPositionChange }) => {
  const mediaRef = useRef(null);
  const isDragging = useRef(false);
  const isResizing = useRef(false);
  const startPos = useRef({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    const element = mediaRef.current;
    if (!element) return;

    element.style.left = `${item.x}px`;
    element.style.top = `${item.y}px`;
    element.style.width = `${item.width}px`;
    element.style.height = `${item.height}px`;
  }, []);

  const handleMouseDown = (e) => {
    if (e.target.classList.contains('resize-handle')) {
      isResizing.current = true;
      const rect = mediaRef.current.getBoundingClientRect();
      startPos.current = {
        x: e.clientX,
        y: e.clientY,
        width: rect.width,
        height: rect.height
      };
    } else if (e.target.closest('.draggable-media-container')) {
      isDragging.current = true;
      const rect = mediaRef.current.getBoundingClientRect();
      startPos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (isResizing.current) {
      const deltaX = e.clientX - startPos.current.x;
      const deltaY = e.clientY - startPos.current.y;
      const newWidth = Math.max(200, startPos.current.width + deltaX);
      const newHeight = Math.max(150, startPos.current.height + deltaY);
      
      mediaRef.current.style.width = `${newWidth}px`;
      mediaRef.current.style.height = `${newHeight}px`;
      onSizeChange(newWidth, newHeight);
    } else if (isDragging.current) {
      const x = e.clientX - startPos.current.x;
      const y = e.clientY - startPos.current.y;
      
      mediaRef.current.style.left = `${x}px`;
      mediaRef.current.style.top = `${y}px`;
      onPositionChange(x, y);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    isResizing.current = false;
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div 
      ref={mediaRef}
      className="draggable-media-container"
      onMouseDown={handleMouseDown}
    >
      {item.type === 'youtube' ? (
        <iframe src={item.url} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ width: '100%', height: '100%' }} />
      ) : item.type === 'video' ? (
        <video src={item.url} controls autoPlay loop style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      ) : (
        <img src={item.url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      )}
      <div className="resize-handle"></div>
    </div>
  );
};

export default ArtAdPanel;
