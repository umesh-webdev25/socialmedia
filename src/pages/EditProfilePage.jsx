import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../api/apiClient';

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateLocalUser } = useAuth();

  const [form, setForm] = useState({
    name:           user?.name           || '',
    bio:            user?.bio            || '',
    profilePicture: user?.profilePicture || '',
  });
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess]     = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setFieldErrors((p) => ({ ...p, [e.target.name]: '' }));
    setSuccess(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setSaving(true);
    try {
      const payload = {};
      if (form.name.trim())           payload.name           = form.name.trim();
      if (form.bio.trim() !== undefined) payload.bio         = form.bio.trim();
      if (form.profilePicture.trim()) payload.profilePicture = form.profilePicture.trim();

      const res = await userAPI.updateProfile(payload);
      const updated = res.data.data.user;
      updateLocalUser(updated);
      setSuccess(true);
      setTimeout(() => navigate('/profile'), 1000);
    } catch (err) {
      if (err.errors) {
        const map = {};
        err.errors.forEach((e) => { map[e.field] = e.message; });
        setFieldErrors(map);
      } else {
        setError(err.message || 'Update failed');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#f6f7f8] font-[Plus_Jakarta_Sans,sans-serif] text-slate-900">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 md:px-20 lg:px-40 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-[#137fec] flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-3xl">arrow_back</span>
          </button>
          <h2 className="text-slate-900 text-xl font-bold leading-tight">Edit Profile</h2>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-xl h-11 px-6 bg-[#137fec] hover:bg-[#137fec]/90 disabled:opacity-60 text-white text-sm font-bold transition-colors"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </header>

      <main className="flex-1 flex justify-center py-8 px-4">
        <div className="flex flex-col max-w-[640px] flex-1 gap-8">

          {success && (
            <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium text-center">
              ✓ Profile updated successfully! Redirecting…
            </div>
          )}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Avatar preview section */}
          <div className="flex flex-col items-center gap-6 bg-white p-8 rounded-xl border border-slate-200">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-[#137fec]/10 overflow-hidden bg-slate-200">
                {form.profilePicture ? (
                  <img
                    src={form.profilePicture}
                    alt="preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#137fec]/10 text-[#137fec] text-4xl font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-slate-900 text-2xl font-bold">{form.name || user?.name}</h3>
              <p className="text-slate-500 text-sm mt-1">Update the URL field below to change your photo</p>
            </div>
          </div>

          {/* Form fields */}
          <form onSubmit={handleSave} className="flex flex-col gap-6 bg-white p-8 rounded-xl border border-slate-200">

            {/* Email — read only */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-slate-700 text-sm font-semibold">Email Address</label>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">lock</span> Read only
                </span>
              </div>
              <div className="flex w-full items-center rounded-xl border border-slate-200 bg-slate-50 h-14 px-4 text-slate-500">
                <span className="material-symbols-outlined mr-3 text-slate-400">mail</span>
                <span className="text-base">{user?.email}</span>
              </div>
            </div>

            {/* Name */}
            <div className="flex flex-col gap-2">
              <label className="text-slate-700 text-sm font-semibold">Name</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">person</span>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className={`w-full rounded-xl border bg-white focus:border-[#137fec] focus:ring-1 focus:ring-[#137fec] h-14 pl-12 pr-4 text-slate-900 text-base transition-all outline-none ${fieldErrors.name ? 'border-red-400' : 'border-slate-200'}`}
                  placeholder="Enter your name"
                />
              </div>
              {fieldErrors.name && <p className="text-red-500 text-xs">{fieldErrors.name}</p>}
            </div>

            {/* Profile Picture URL */}
            <div className="flex flex-col gap-2">
              <label className="text-slate-700 text-sm font-semibold">Profile Picture URL</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">link</span>
                <input
                  name="profilePicture"
                  type="url"
                  value={form.profilePicture}
                  onChange={handleChange}
                  className={`w-full rounded-xl border bg-white focus:border-[#137fec] focus:ring-1 focus:ring-[#137fec] h-14 pl-12 pr-4 text-slate-900 text-base transition-all outline-none ${fieldErrors.profilePicture ? 'border-red-400' : 'border-slate-200'}`}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
              {fieldErrors.profilePicture && <p className="text-red-500 text-xs">{fieldErrors.profilePicture}</p>}
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-2">
              <label className="text-slate-700 text-sm font-semibold">Bio</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-4 text-slate-400">description</span>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  maxLength={200}
                  className={`w-full min-h-[120px] rounded-xl border bg-white focus:border-[#137fec] focus:ring-1 focus:ring-[#137fec] pl-12 pr-4 py-3 text-slate-900 text-base transition-all outline-none resize-none ${fieldErrors.bio ? 'border-red-400' : 'border-slate-200'}`}
                  placeholder="Tell us about yourself…"
                />
              </div>
              <div className="flex justify-between">
                {fieldErrors.bio ? <p className="text-red-500 text-xs">{fieldErrors.bio}</p> : <span />}
                <p className="text-xs text-slate-500 italic">{form.bio.length}/200 characters</p>
              </div>
            </div>
          </form>

          {/* Danger zone */}
          <div className="flex items-center justify-between px-2">
            <button className="text-red-500 font-semibold text-sm hover:text-red-600 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">delete</span>
              Deactivate Account
            </button>
            <p className="text-slate-500 text-xs">
              Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}
            </p>
          </div>
        </div>
      </main>

      <footer className="py-10" />
    </div>
  );
};

export default EditProfilePage;
