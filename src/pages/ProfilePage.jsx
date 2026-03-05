import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postAPI } from '../api/apiClient';
import Navbar from '../components/Navbar';
import { formatDistanceToNow } from '../utils/dateUtils';

const ProfilePage = () => {
  const { user } = useAuth();

  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]    = useState('');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await postAPI.getMy();
        setPosts(res.data.data.posts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

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

      <main className="flex-1 max-w-5xl mx-auto w-full py-8 px-4 md:px-10">
        <div className="flex flex-col gap-8">

          {/* Profile Card */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200">
            {/* Cover banner */}
            <div className="h-48 w-full bg-gradient-to-r from-[#137fec] to-blue-400 relative">
              <div className="absolute inset-0 bg-slate-900/10" />
            </div>

            <div className="px-8 pb-8 flex flex-col items-center sm:items-start relative">
              {/* Avatar */}
              <div className="relative -mt-16 mb-4">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-lg">
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#137fec]/10 text-[#137fec] text-4xl font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between w-full items-start gap-4">
                <div className="flex flex-col text-center sm:text-left">
                  <h1 className="text-3xl font-bold text-slate-900">{user?.name}</h1>
                  <p className="text-[#137fec] font-medium text-lg">@{user?.name?.toLowerCase().replace(/\s+/g, '_')}</p>
                  <div className="flex items-center gap-2 mt-2 text-slate-500">
                    <span className="material-symbols-outlined text-sm">mail</span>
                    <span className="text-sm font-medium">{user?.email}</span>
                  </div>
                  {user?.bio && (
                    <p className="mt-4 text-slate-600 max-w-2xl text-base leading-relaxed">{user.bio}</p>
                  )}
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                  <Link
                    to="/edit-profile"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[#137fec] text-white font-bold rounded-lg hover:bg-[#137fec]/90 transition-all shadow-md shadow-[#137fec]/20"
                  >
                    <span className="material-symbols-outlined text-xl">edit</span>
                    <span>Edit Profile</span>
                  </Link>
                  <button className="flex items-center justify-center px-3 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition-all">
                    <span className="material-symbols-outlined">share</span>
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-8 border-t border-slate-100 pt-6 w-full">
                <div className="flex flex-col items-center sm:items-start">
                  <span className="text-xl font-bold text-slate-900">{posts.length}</span>
                  <span className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Posts</span>
                </div>
                <div className="flex flex-col items-center sm:items-start">
                  <span className="text-xl font-bold text-slate-900">—</span>
                  <span className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Followers</span>
                </div>
                <div className="flex flex-col items-center sm:items-start">
                  <span className="text-xl font-bold text-slate-900">—</span>
                  <span className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Following</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200 gap-8">
            <button className="pb-4 border-b-2 border-[#137fec] text-[#137fec] font-bold text-sm tracking-wide">MY POSTS</button>
            <button className="pb-4 border-b-2 border-transparent text-slate-500 font-semibold text-sm tracking-wide hover:text-slate-700 transition-colors">MEDIA</button>
          </div>

          {/* Posts grid */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-[#137fec] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <p className="text-red-500 text-center py-8">{error}</p>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <span className="material-symbols-outlined text-5xl block mb-3">article</span>
              <p className="font-semibold">You haven't posted anything yet.</p>
              <Link to="/feed" className="mt-3 inline-block text-[#137fec] text-sm font-bold hover:underline">
                Go to feed and create a post
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div key={post._id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 group hover:shadow-md transition-shadow">
                  {post.image && (
                    <div className="h-48 overflow-hidden">
                      <img src={post.image} alt="post" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  {!post.image && (
                    <div className="h-32 bg-gradient-to-br from-[#137fec]/10 to-blue-100 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#137fec] text-4xl">article</span>
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-[#137fec] uppercase bg-[#137fec]/10 px-2 py-1 rounded">Post</span>
                      <span className="text-xs text-slate-400 font-medium">{formatDistanceToNow(post.createdAt)}</span>
                    </div>
                    {post.text && (
                      <p className="text-sm text-slate-600 line-clamp-2 mt-2">{post.text}</p>
                    )}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-3 text-slate-500">
                        <span className="material-symbols-outlined text-lg">favorite</span>
                        <span className="material-symbols-outlined text-lg">chat_bubble</span>
                      </div>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                        title="Delete post"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="mt-auto py-8 px-10 border-t border-slate-200 text-center text-slate-500 text-sm">
        <p>© 2024 SocialMedia Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ProfilePage;
