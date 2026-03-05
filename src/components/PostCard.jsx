import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from '../utils/dateUtils';

const PostCard = ({ post, onDelete }) => {
  const { user } = useAuth();
  const isOwner = user?._id === (post.user?._id || post.user);

  const avatar = post.user?.profilePicture;
  const authorName = post.user?.name || 'Unknown';

  return (
    <article className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {avatar ? (
            <img src={avatar} alt={authorName} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#137fec]/10 flex items-center justify-center text-[#137fec] font-bold text-sm">
              {authorName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-slate-900 font-bold text-sm leading-tight">{authorName}</p>
            <p className="text-slate-400 text-xs">{formatDistanceToNow(post.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isOwner && (
            <button className="px-3 py-1.5 rounded-lg bg-[#137fec]/10 text-[#137fec] text-xs font-bold hover:bg-[#137fec] hover:text-white transition-all">
              Follow
            </button>
          )}
          {isOwner && (
            <button
              onClick={() => onDelete(post._id)}
              className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
              title="Delete post"
            >
              <span className="material-symbols-outlined text-xl">delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Text */}
      {post.text && (
        <div className="px-4 pb-3">
          <p className="text-slate-700 text-base leading-relaxed">{post.text}</p>
        </div>
      )}

      {/* Image */}
      {post.image && (
        <div className="w-full aspect-video overflow-hidden">
          <img src={post.image} alt="post" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Actions */}
      <div className="p-3 flex items-center gap-6 border-t border-slate-50">
        <button className="flex items-center gap-1.5 text-slate-500 hover:text-red-500 transition-colors group">
          <span className="material-symbols-outlined text-[22px] group-hover:scale-110 transition-transform">favorite</span>
        </button>
        <button className="flex items-center gap-1.5 text-slate-500 hover:text-[#137fec] transition-colors group">
          <span className="material-symbols-outlined text-[22px] group-hover:scale-110 transition-transform">chat_bubble</span>
        </button>
        <button className="flex items-center gap-1.5 text-slate-500 hover:text-green-500 transition-colors group">
          <span className="material-symbols-outlined text-[22px] group-hover:scale-110 transition-transform">share</span>
        </button>
      </div>
    </article>
  );
};

export default PostCard;
