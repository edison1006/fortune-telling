import { useState, useEffect, useCallback } from 'react';
import { translations } from '../utils/translations';

const STORAGE_KEY = 'fortune_community_posts';

function loadPosts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      return Array.isArray(data) ? data : [];
    }
  } catch (_) {}
  return [];
}

function savePosts(posts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (_) {}
}

function formatDate(isoStr, language) {
  const d = new Date(isoStr);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) {
    return d.toLocaleTimeString(language === 'zh' ? 'zh-CN' : 'en', { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const CATEGORIES = [
  { id: 'askSlip', key: 'categoryAskSlip' },
  { id: 'share', key: 'categoryShare' },
  { id: 'askMaster', key: 'categoryAskMaster' },
];

function CommunityPage({ onBack, language }) {
  const t = translations[language] || translations.en;
  const p = t.communityPage || {};
  const [posts, setPosts] = useState(loadPosts);
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState('askSlip');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const refreshPosts = useCallback(() => setPosts(loadPosts()), []);

  useEffect(() => {
    if (!showForm) refreshPosts();
  }, [showForm, refreshPosts]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const t1 = (title || '').trim();
    const c1 = (content || '').trim();
    if (!t1 && !c1) return;
    const next = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      category,
      title: t1 || p.placeholderTitle,
      content: c1 || '',
      createdAt: new Date().toISOString(),
      upvotes: 0,
    };
    const updated = [next, ...loadPosts()];
    savePosts(updated);
    setPosts(updated);
    setTitle('');
    setContent('');
    setShowForm(false);
  };

  const handleUpvote = (id) => {
    const updated = posts.map((post) =>
      post.id === id ? { ...post, upvotes: (post.upvotes || 0) + 1 } : post
    );
    savePosts(updated);
    setPosts(updated);
  };

  const getCategoryLabel = (catId) => {
    const c = CATEGORIES.find((x) => x.id === catId);
    return c ? (p[c.key] || catId) : catId;
  };

  return (
    <main className="main community-page">
      <button type="button" className="btn back-button" onClick={onBack}>
        ← {t.backToHome}
      </button>
      <div className="community-header">
        <h1>{p.title}</h1>
        <p>{p.subtitle}</p>
        <button
          type="button"
          className="btn btn-primary community-new-post"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? p.cancel : p.newPost}
        </button>
      </div>

      {showForm && (
        <form className="community-form" onSubmit={handleSubmit}>
          <label className="community-form-label">
            <span>{p.placeholderTitle}</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="community-select">
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{p[c.key]}</option>
              ))}
            </select>
          </label>
          <input
            type="text"
            className="community-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={p.placeholderTitle}
            aria-label={p.placeholderTitle}
          />
          <textarea
            className="community-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={p.placeholderContent}
            rows={4}
            aria-label={p.placeholderContent}
          />
          <button type="submit" className="btn btn-primary">
            {p.submit}
          </button>
        </form>
      )}

      <div className="community-feed">
        {posts.length === 0 ? (
          <p className="community-empty">{p.noPosts}</p>
        ) : (
          <ul className="community-list">
            {posts.map((post) => (
              <li key={post.id} className="community-post">
                <div className="community-post-vote">
                  <button
                    type="button"
                    className="community-upvote"
                    onClick={() => handleUpvote(post.id)}
                    aria-label={p.upvote}
                  >
                    ▲
                  </button>
                  <span className="community-upvote-count">{post.upvotes || 0}</span>
                </div>
                <div className="community-post-body">
                  <span className="community-post-category">{getCategoryLabel(post.category)}</span>
                  <h3 className="community-post-title">{post.title}</h3>
                  {post.content ? <p className="community-post-content">{post.content}</p> : null}
                  <span className="community-post-meta">
                    {p.anonymous} · {p.postedAt} {formatDate(post.createdAt, language)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

export default CommunityPage;
