import { useEffect, useState } from 'react';
import API from '../api';

function formatProjectsForForm(projects) {
  if (!projects?.length) return '';
  return projects
    .map((p) => {
      if (typeof p === 'string') return p;
      if (p && typeof p === 'object') {
        const t = p.title || '';
        const d = p.description || '';
        return d ? `${t}: ${d}` : t;
      }
      return '';
    })
    .filter(Boolean)
    .join(', ');
}

export default function Profile() {
  const [profile, setProfile] = useState({
    name: '',
    college: '',
    major: '',
    year: '',
    skills: '',
    projects: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await API.get('/auth/profile');
      setProfile({
        name: data.name || '',
        college: data.college || '',
        major: data.major || '',
        year: data.year || '',
        skills: (data.skills || []).join(', '),
        projects: formatProjectsForForm(data.projects),
      });
    };

    fetchProfile().catch((err) => {
      setMessage(err?.response?.data?.msg || 'Failed to load profile');
    });
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put('/auth/profile', {
        name: profile.name,
        college: profile.college,
        major: profile.major,
        year: profile.year,
        skills: profile.skills
          ? profile.skills.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        projects: profile.projects
          ? profile.projects.split(',').map((p) => p.trim()).filter(Boolean)
          : [],
      });
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage(
        err.response?.data?.msg || 'Update failed. Check the server console.'
      );
    }
  };

  return (
    <div className="page page--auth">
    <div className="profile-container">
      <h2>Your Profile</h2>
      {message && <div className="success">{message}</div>}
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input name="name" value={profile.name} onChange={handleChange} />
        <label>College / university</label>
        <input
          name="college"
          value={profile.college}
          onChange={handleChange}
        />
        <label>Major</label>
        <input name="major" value={profile.major} onChange={handleChange} />
        <label>Year</label>
        <select name="year" value={profile.year} onChange={handleChange}>
          <option value="">Select Year</option>
          <option value="Freshman">Freshman</option>
          <option value="Sophomore">Sophomore</option>
          <option value="Junior">Junior</option>
          <option value="Senior">Senior</option>
          <option value="Graduate">Graduate</option>
        </select>
        <label>Skills (comma-separated)</label>
        <input name="skills" value={profile.skills} onChange={handleChange} />
        <label>Projects (comma-separated)</label>
        <input
          name="projects"
          value={profile.projects}
          onChange={handleChange}
        />
        <button type="submit">Save Profile</button>
      </form>
    </div>
    </div>
  );
}

