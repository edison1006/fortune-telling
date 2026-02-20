import { useState, useRef, useEffect, useCallback } from 'react';
import { translations } from '../utils/translations';
import { API_BASE } from '../utils/constants';

const WIDGET_STORAGE_KEY = 'ai_master_widget';

function loadWidgetState() {
  try {
    const s = localStorage.getItem(WIDGET_STORAGE_KEY);
    if (s) {
      const parsed = JSON.parse(s);
      if (parsed && ['left', 'right'].includes(parsed.side) && typeof parsed.bottom === 'number') {
        return {
          side: parsed.side,
          bottom: Math.max(20, Math.min(parsed.bottom, 400)),
          locked: !!parsed.locked,
        };
      }
    }
  } catch (_) {}
  return { side: 'right', bottom: 100, locked: false };
}

function saveWidgetState(side, bottom, locked) {
  try {
    localStorage.setItem(WIDGET_STORAGE_KEY, JSON.stringify({ side, bottom, locked }));
  } catch (_) {}
}

function AIChatWidget({ language }) {
  const t = translations[language] || translations.en;
  const chatT = t.aiChatPage || {};
  const initialState = loadWidgetState();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ side: initialState.side, bottom: initialState.bottom });
  const [locked, setLocked] = useState(initialState.locked);
  const [messages, setMessages] = useState(() => [
    { role: 'assistant', content: chatT.welcome || 'Hello, I am the AI Master.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ y: 0, bottom: 0, side: 'right' });
  const didDrag = useRef(false);
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current?.scrollHeight);
  }, [messages, loading]);

  const persistPosition = useCallback((side, bottom, isLocked) => {
    saveWidgetState(side, bottom, isLocked);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const handleMove = (e) => {
      didDrag.current = true;
      const dy = dragStart.current.y - e.clientY;
      const newBottom = Math.max(20, Math.min(400, dragStart.current.bottom + dy));
      const winW = window.innerWidth;
      const newSide = e.clientX < winW / 2 ? 'left' : 'right';
      setPosition({ side: newSide, bottom: newBottom });
    };
    const handleUp = () => {
      setDragging(false);
      setPosition((p) => {
        persistPosition(p.side, p.bottom, locked);
        return p;
      });
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [dragging, locked, persistPosition]);

  const handleLockToggle = () => {
    setLocked((prev) => {
      const next = !prev;
      setPosition((p) => {
        persistPosition(p.side, p.bottom, next);
        return p;
      });
      return next;
    });
  };

  const handleIconMouseDown = (e) => {
    didDrag.current = false;
    if (locked) return;
    if (e.button !== 0) return;
    e.preventDefault();
    dragStart.current = { y: e.clientY, bottom: position.bottom, side: position.side };
    setDragging(true);
  };

  const handleIconClick = () => {
    if (didDrag.current) return;
    setOpen((prev) => !prev);
  };

  const sendMessage = async () => {
    const text = (input || '').trim();
    if (!text || loading) return;
    setInput('');
    setError(null);
    const userMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);
    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          language: language || 'zh',
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error(chatT.error);
      const data = await res.json();
      const reply = (data.reply || '').trim() || chatT.error;
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (e) {
      setError(e.name === 'AbortError' ? chatT.error : chatT.error);
      setMessages((prev) => [...prev, { role: 'assistant', content: chatT.error }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const widgetLabel = chatT.title || 'AI Master';

  return (
    <>
      <div
        className={`ai-widget-icon-wrap ${position.side} ${locked ? 'locked' : ''} ${dragging ? 'dragging' : ''}`}
        style={{
          [position.side]: 12,
          bottom: position.bottom,
        }}
      >
        <button
          type="button"
          className="ai-widget-icon"
          onClick={handleIconClick}
          onMouseDown={handleIconMouseDown}
          aria-label={widgetLabel}
          aria-expanded={open}
          title={widgetLabel}
        >
          <span className="ai-widget-icon-emoji" aria-hidden="true">🧙</span>
        </button>
        <button
          type="button"
          className="ai-widget-lock"
          onClick={(e) => { e.stopPropagation(); handleLockToggle(); }}
          aria-label={locked ? (t.aiChatPage?.unlock || 'Unlock') : (t.aiChatPage?.lock || 'Lock to side')}
          title={locked ? (t.aiChatPage?.unlock || 'Unlock') : (t.aiChatPage?.lock || 'Lock to side')}
        >
          {locked ? '🔒' : '🔓'}
        </button>
      </div>

      {open && (
        <div
          className="ai-widget-panel"
          role="dialog"
          aria-label={widgetLabel}
        >
          <div className="ai-widget-panel-inner">
            <div className="ai-widget-panel-header">
              <h3>{widgetLabel}</h3>
              <button
                type="button"
                className="ai-widget-close"
                onClick={() => setOpen(false)}
                aria-label={t.backToHome || 'Close'}
              >
                ×
              </button>
            </div>
            <div className="ai-widget-chat">
              <div className="chat-messages ai-widget-messages" ref={listRef} role="log">
                {messages.map((msg, i) => (
                  <div key={i} className={`chat-bubble chat-bubble--${msg.role}`}>
                    <span className="chat-bubble-role" aria-hidden="true">{msg.role === 'user' ? 'You' : 'AI'}</span>
                    <div className="chat-bubble-content">{msg.content}</div>
                  </div>
                ))}
                {loading && (
                  <div className="chat-bubble chat-bubble--assistant chat-bubble--loading">
                    <span className="chat-bubble-role" aria-hidden="true">AI</span>
                    <div className="chat-bubble-content">{chatT.thinking}</div>
                  </div>
                )}
              </div>
              {error && <p className="chat-error" role="alert">{error}</p>}
              <div className="chat-input-row">
                <textarea
                  className="chat-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={chatT.placeholder}
                  rows={2}
                  disabled={loading}
                  aria-label={chatT.placeholder}
                />
                <button
                  type="button"
                  className="btn btn-primary chat-send"
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  aria-label={chatT.send}
                >
                  {chatT.send}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {open && <div className="ai-widget-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />}
    </>
  );
}

export default AIChatWidget;
