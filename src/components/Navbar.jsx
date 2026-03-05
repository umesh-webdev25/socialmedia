import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white px-6 lg:px-40 py-3">
      <div className="flex items-center gap-8">
        <Link to="/feed">
          <Logo />
        </Link>
        <div className="hidden md:flex w-full max-w-64 h-10">
          <div className="flex w-full items-stretch rounded-lg overflow-hidden">
            <div className="flex items-center justify-center pl-4 bg-slate-100 text-slate-400">
              <span className="material-symbols-outlined text-xl">search</span>
            </div>
            <input
              className="w-full bg-slate-100 text-slate-900 focus:outline-none px-3 text-sm placeholder:text-slate-400"
              placeholder="Search friends, posts..."
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <nav className="hidden sm:flex items-center gap-6">
          <Link
            to="/feed"
            className={`text-sm font-semibold flex items-center gap-1 transition-colors ${isActive('/feed') ? 'text-[#137fec]' : 'text-slate-600 hover:text-[#137fec]'}`}
          >
            <span className="material-symbols-outlined text-lg">home</span> Home
          </Link>
          <Link
            to="/profile"
            className={`text-sm font-semibold flex items-center gap-1 transition-colors ${isActive('/profile') ? 'text-[#137fec]' : 'text-slate-600 hover:text-[#137fec]'}`}
          >
            <span className="material-symbols-outlined text-lg">person</span> Profile
          </Link>
          <button
            onClick={handleLogout}
            className="text-slate-600 text-sm font-medium hover:text-red-500 transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-lg">logout</span> Logout
          </button>
        </nav>

        <Link to="/profile">
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.name}
              className="w-10 h-10 rounded-full border-2 border-[#137fec]/20 object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full border-2 border-[#137fec]/20 bg-[#137fec]/10 flex items-center justify-center text-[#137fec] font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
