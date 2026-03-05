import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postAPI } from '../api/apiClient';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';

const HomeFeed = () => {
  const { user } = useAuth();

  const [posts, setPosts]         = useState([]);
  const [loadingPosts, setLoading] = useState(true);
  const [error, setError]         = useState('');
  const [text, setText]           = useState('');
  const [imageUrl, setImageUrl]   = useState('');
  const [showImg, setShowImg]     = useState(false);
  const [posting, setPosting]     = useState(false);
  const [postError, setPostError] = useState('');

  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await postAPI.getAll();
      setPosts(res.data.data.posts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imageUrl.trim()) {
      setPostError('Add text or an image URL to post.');
      return;
    }
    setPostError('');
    setPosting(true);
    try {
      const res = await postAPI.create({
        text: text.trim() || undefined,
        image: imageUrl.trim() || undefined,
      });
      setPosts((prev) => [res.data.data.post, ...prev]);
      setText('');
      setImageUrl('');
      setShowImg(false);
    } catch (err) {
      setPostError(err.message);
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await postAPI.remove(id);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7f8] font-[Plus_Jakarta_Sans,sans-serif] text-slate-900">
      <Navbar />

      <div className="flex flex-1 justify-center py-8">
        {/* Left sidebar */}
        <aside className="hidden xl:flex fixed left-10 top-24 w-[240px] flex-col gap-2">
          <Link to="/feed" className="flex items-center gap-3 p-3 rounded-lg bg-[#137fec]/10 text-[#137fec] font-bold">
            <span className="material-symbols-outlined">home</span><span>Feed</span>
          </Link>
          {[
            { icon: 'explore', label: 'Explore' },
            { icon: 'notifications', label: 'Notifications' },
            { icon: 'mail', label: 'Messages' },
            { icon: 'bookmark', label: 'Saved Posts' },
          ].map(({ icon, label }) => (
            <span key={label} className="flex items-center gap-3 p-3 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer">
              <span className="material-symbols-outlined">{icon}</span><span>{label}</span>
            </span>
          ))}
          <hr className="my-2 border-slate-200" />
          <Link to="/profile" className="flex items-center gap-3 p-3 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
            <span className="material-symbols-outlined">settings</span><span>Settings</span>
          </Link>
        </aside>

        {/* Feed */}
        <div className="flex flex-col max-w-[680px] flex-1 px-4 gap-6">

          {/* Create Post */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <form onSubmit={handleCreate}>
              <div className="flex gap-4">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt={user.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#137fec]/10 flex items-center justify-center text-[#137fec] font-bold shrink-0">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-3">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full resize-none border-none bg-transparent text-slate-900 focus:outline-none focus:ring-0 text-lg placeholder:text-slate-400"
                    placeholder={`What's on your mind, ${user?.name?.split(' ')[0]}?`}
                    rows={2}
                  />
                  {showImg && (
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Paste an image URL…"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#137fec] transition-all"
                    />
                  )}
                  {postError && <p className="text-red-500 text-xs">{postError}</p>}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowImg((v) => !v)}
                        className={`p-2 rounded-lg hover:bg-slate-100 transition-colors ${showImg ? 'text-[#137fec]' : 'text-[#137fec]'}`}
                      >
                        <span className="material-symbols-outlined">image</span>
                      </button>
                    </div>
                    <button
                      type="submit"
                      disabled={posting}
                      className="min-w-[100px] cursor-pointer flex items-center justify-center rounded-lg h-10 px-5 bg-[#137fec] text-white text-sm font-bold shadow-md hover:bg-[#137fec]/90 transition-all disabled:opacity-60"
                    >
                      {posting ? 'Posting…' : 'Post'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Feed separator */}
          <div className="flex items-center gap-4 px-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Recent Feed</span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          {/* Posts */}
          {loadingPosts ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-[#137fec] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 font-medium">{error}</p>
              <button onClick={fetchPosts} className="mt-3 text-[#137fec] text-sm font-bold hover:underline">Retry</button>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <span className="material-symbols-outlined text-5xl block mb-3">article</span>
              <p className="font-semibold">No posts yet. Be the first to share!</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard key={post._id} post={post} onDelete={handleDelete} />
            ))
          )}

          {/* End of feed */}
          {!loadingPosts && !error && posts.length > 0 && (
            <div className="flex flex-col items-center py-6 gap-2">
              <div className="w-2 h-2 bg-[#137fec] rounded-full animate-bounce" />
              <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">End of Feed</p>
            </div>
          )}
        </div>

        {/* Right sidebar — suggested (static) */}
        <aside className="hidden xl:flex fixed right-10 top-24 w-[300px] flex-col gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <h3 className="text-slate-900 font-bold mb-4">Suggested for you</h3>
            <div className="flex flex-col gap-4">
              {[
                { name: 'Elena Rossi', title: 'Designer', initials: 'E' },
                { name: 'Julian Moss', title: 'Software Engineer', initials: 'J' },
              ].map((u) => (
                <div key={u.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#137fec]/10 flex items-center justify-center text-[#137fec] font-bold text-sm">
                      {u.initials}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{u.name}</p>
                      <p className="text-xs text-slate-400">{u.title}</p>
                    </div>
                  </div>
                  <button className="text-[#137fec] text-xs font-bold hover:underline">Follow</button>
                </div>
              ))}
            </div>
          </div>
          <div className="px-4">
            <p className="text-slate-400 text-[10px] uppercase tracking-tighter">© 2024 SocialMedia Inc. • Help • Privacy • Terms</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default HomeFeed;
